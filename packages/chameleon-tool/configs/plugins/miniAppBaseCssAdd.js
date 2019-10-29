const path = require('path');
const cmlUtils = require('chameleon-tool-utils');
class miniappBaseCssAdd {
  constructor(options) {
    this.cmlType = options.cmlType;
    this.isInjectBaseStyle = options.isInjectBaseStyle;
  }
  apply(compiler) {
    let self = this;
    let cssExt = {
      'wx': '.wxss',
      'alipay': '.acss',
      'baidu': '.css',
      'qq': '.qss'
    }
    if (compiler.hooks) {
      compiler.hooks.shouldEmit.tap('miniappBaseCssAdd', miniappBaseCssAdd);
    } else {
      compiler.plugin('should-emit', miniappBaseCssAdd);
    }

    function miniappBaseCssAdd(compilation, callback) {
      if (self.isInjectBaseStyle) { // 只有配置导入样式的时候，才进行样式的导入
        Object.keys(compilation.assets).forEach((assetPath) => {
          let ext = path.extname(assetPath);
          let platformCss = cssExt[self.cmlType];
          let pageCss = cmlUtils.handleWinPath(`static/css/page${platformCss}`);
          let pageCssEntryPath = cmlUtils.handleWinPath(`static/js/static/css/page.js`);
          let indexCss = cmlUtils.handleWinPath(`static/css/index${platformCss}`);
          let indexCssEntryPath = cmlUtils.handleWinPath(`static/js/static/css/index.js`);
          //删除因为新增 css 入口导致的  js 文件；
          delete compilation.assets[pageCssEntryPath];
          delete compilation.assets[indexCssEntryPath];
          if ((ext === platformCss) && ![pageCss, indexCss].includes(assetPath)) {
            // 是对应的css样式，且不能是 static/css/index.wxss static/css/page.wxss 公用样式中不能再导入公用基础样式；
            let primaryCss = compilation.assets[assetPath].source();
            let primaryCssSize = compilation.assets[assetPath].size();
            let assetType = judgeAssetType(assetPath, compilation);
            // app 不导入基础样式  page 导入 page.css  component 导入 index.css
            // 注意生成的资源中 static/css/page.wxss 这样的对应平台的后缀影响assetType判断
            if (assetType === 'page') {
              compilation.assets[assetPath] = {
                source() {
                  if (compilation.assets[pageCss]) { // 如果有page.css ，那么插入page.css
                    return `@import '/static/css/page${platformCss}'; \n ${primaryCss}`
                  } else {
                    return `@import '/static/css/index${platformCss}'; \n ${primaryCss}`
                  }
                },
                size() {
                  return primaryCssSize
                }
              }
            }
            if (assetType === 'component') {
              compilation.assets[assetPath] = {
                source() {
                  return `@import '/static/css/index${platformCss}'; \n ${primaryCss}`
                },
                size() {
                  return primaryCssSize
                }
              }
            }
          }

        })
      }
      return true;
    }
    function judgeAssetType(assetCssPath, compilation) {
      let type = 'page';
      let jsonPath = assetCssPath.replace(cssExt[self.cmlType], '.json');
      let jsonObject = compilation.assets[jsonPath] && JSON.parse(compilation.assets[jsonPath].source());
      if (assetCssPath === `app${cssExt[self.cmlType]}`) {
        type = 'app';
      } else {
        if (jsonObject && (jsonObject.component === true)) {
          type = 'component';
        }
      }
      return type;
    }
  }
}
module.exports = miniappBaseCssAdd;

