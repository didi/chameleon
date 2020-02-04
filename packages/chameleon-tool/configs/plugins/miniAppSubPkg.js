const path = require('path');
const cmlUtils = require('chameleon-tool-utils');

/*
小程序分包：1 微信限制主包不能引用分包的组件 2 分包可以引用主包的组件  3 分包不能引用分包的组件
*/
class MiniAppSubPkg {
  constructor(options) {
    this.cmlType = options.cmlType;
    this.root = options.root;
  }

  apply(compiler) {
    /* eslint-disable-next-line */
    let self = this;

    if (compiler.hooks) {
      compiler.hooks.emit.tap('miniAppSubPkg', miniappsubpkg);
    } else {
      // compiler.plugin('emit', miniappsubpkg);
      compiler.plugin('emit', miniappsubpkg);
    }
    function miniappsubpkg(compilation, callback) {
      // 第一步处理app.json
      let appJSONString = compilation.assets['app.json'] && compilation.assets['app.json'].source();

      let appJson = (appJSONString && JSON.parse(appJSONString)) || {};
      let {pages, subPackages} = appJson;
      if (!subPackages || !Array.isArray(subPackages)) { // 不存在分包配置或者配置不是数组直接执行callback
        return callback();
      }
      let subPagesArr = [];
      let subPagesRoot = []
      subPackages.forEach((pkg) => {
        subPagesRoot.push(pkg.root);
        if (Array.isArray(pkg.pages)) {
          pkg.pages.forEach((subpage) => {
            // subPagesArr.push(path.normalize(`${pkg.root}/${subpage}`))
            let subPkgPath = path.normalize(`${pkg.root}/${subpage}`)
            subPagesArr.push(cmlUtils.handleWinPath(subPkgPath))
          })
        }
      });
      let newPages = pages.filter((item) => !subPagesArr.includes(item));
      appJson.pages = newPages;
      /* eslint-disable-next-line */
      compilation.assets['app.json']._value = JSON.stringify(appJson, '', 4)// 重写app.json文件；
      // 处理分包的页面js
      const subCompsArr = self.getSubpkgComp(subPagesRoot, compilation);
      // 修复重复对于页面的js分离操作，subCompsArr里面会进行分离
      // self.handleJsContent(subPagesArr,compilation);
      self.handleJsContent(subCompsArr, compilation);
      callback();
    }
  }

  getSubpkgComp(subPagesRoot, compilation) {
    let assetsKeys = Object.keys(compilation.assets) || [];
    let subPageCompKeys = assetsKeys.filter((assetsKey) => subPagesRoot.some((item) => assetsKey.startsWith(item) && assetsKey.endsWith('js')));
    subPageCompKeys = subPageCompKeys.map((k) => k.replace('\.js', ''));
    return subPageCompKeys

  }

  handleJsContent(pathArr, compilation) {
    // 第二步将subpage中的js文件拷贝到pages/subpage中的js文件中； outputFileSync
    // 第三步删除static/js 中的subpage的js文件；removeSync
    let regStatic = /require\(.*?static\/js\/.*?\)\(\)/;
    let regMainfest = /var.*?require\(.*?manifest\.js.*?\)/;
    pathArr.forEach((item) => {
      let subPageJSPath = cmlUtils.handleWinPath(`${item}.js`);
      let subPageStaticJSPath = cmlUtils.handleWinPath(`static/js/${item}.js`);
      let content = compilation.assets[subPageJSPath] && compilation.assets[subPageJSPath].source();

      if (content) {
        content = content.replace(regStatic, '')
      }
      let staticContent = compilation.assets[subPageStaticJSPath] && compilation.assets[subPageStaticJSPath].source();
      if (staticContent) {
        staticContent = staticContent.replace(regMainfest, '');
        staticContent = staticContent.replace(/;$/, '()')
        delete compilation.assets[subPageStaticJSPath];
        // 注意 assets中的key configurable与否
      }
      let finalContent = content + '\n' + staticContent;
      // 修复分包依赖的js资源更新，打包结果不更新
      if (compilation.assets[subPageJSPath]) {
        compilation.assets[subPageJSPath] = {
          source() {
            return finalContent;
          },
          size() {
            return finalContent.length;
          }
        }
      }
    });

  }
}
module.exports = MiniAppSubPkg;

