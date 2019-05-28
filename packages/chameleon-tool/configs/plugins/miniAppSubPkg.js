const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
const cmlUtils = require('chameleon-tool-utils');
class MiniAppSubPkg {
  constructor(options) {
    this.cmlType = options.cmlType;
    this.root = options.root;
  }
  apply(compiler) {
    let self = this;

    if (compiler.hooks) {
      compiler.hooks.done.tap('miniAppSubPkg', miniappsubpkg);
    } else {
      // compiler.plugin('emit', miniappsubpkg);
      compiler.plugin('done', miniappsubpkg);
    }
    function miniappsubpkg(stats) {
      debugger;
      // 第一步处理app.json
      let appJSONString = '';
      let appJSONPath = path.resolve(cml.projectRoot, `dist/${self.cmlType}/app.json`)
      if (cmlUtils.isFile(appJSONPath)) {
        appJSONString = fs.readFileSync(appJSONPath, 'utf8');
      }
      let appJson = (appJSONString && JSON.parse(appJSONString)) || {};
      let {pages, subpackages} = appJson;
      if (!subpackages || !Array.isArray(subpackages)) { // 不存在分包配置或者配置不是数组直接执行callback
        return ;
      }
      let subPagesArr = [];
      let subPagesRoot = []
      subpackages.forEach((pkg) => {
        subPagesRoot.push(pkg.root);
        if (Array.isArray(pkg.pages)) {
          pkg.pages.forEach((subpage) => {
            subPagesArr.push(path.normalize(`${pkg.root}/${subpage}`))
          })
        }
      });
      let newPages = pages.filter((item) => !subPagesArr.includes(item));
      appJson.pages = newPages;
      fse.outputJsonSync(path.resolve(cml.projectRoot, `dist/${self.cmlType}/app.json`), JSON.parse(JSON.stringify(appJson)), {spaces: 4}) ;// 重写app.json文件；
      // 第二步将subpage中的js文件拷贝到pages/subpage中的js文件中； outputFileSync
      // 第三步删除static/js 中的subpage的js文件；removeSync
      let regStatic = /require\(.*?static\/js\/pages.*?\)/;
      let regMainfest = /var.*?require\(.*?manifest\.js.*?\)/
      subPagesArr.forEach((item) => {
        let subPageJSPath = path.resolve(cml.projectRoot, `dist/${self.cmlType}/${item}.js`);
        let subPageStaticJSPath = path.resolve(cml.projectRoot, `dist/${self.cmlType}/static/js/${item}.js`);
        let content = ''
        if (cmlUtils.isFile(subPageJSPath)) {
          content = fs.readFileSync(subPageJSPath, 'utf8');
          content = content.replace(regStatic, '')
        }
        let staticContent = '';
        if (cmlUtils.isFile(subPageStaticJSPath)) {
          staticContent = fs.readFileSync(subPageStaticJSPath, 'utf8');
          staticContent = staticContent.replace(regMainfest, '')
        }
        let finalContent = content + '\n' + staticContent;

        fse.outputFileSync(subPageJSPath, finalContent);
        console.log('subPageStaticJSPath', subPageStaticJSPath);
        console.log('subPageJSPath', subPageJSPath);
      });
      subPagesRoot.forEach((item) => {
        let subPageStaticJSDir = path.resolve(cml.projectRoot, `dist/${self.cmlType}/static/js/${item}`);
        fse.removeSync(subPageStaticJSDir);
      })
    }
  }
}

/**
 * "{
    "window": {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#fff",
        "navigationBarTitleText": "Chameleon",
        "navigationBarTextStyle": "black"
    },
    "subpackages": [
        {
            "root": "pages/subpage",
            "pages": [
                "page2/page2"
            ]
        }
    ],
    "pages": [
        "pages/index/index",
        "pages/subpage/page2/page2"
    ],
    "usingComponents": {}
}"
*/
module.exports = MiniAppSubPkg;


