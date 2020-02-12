const parse = require('../parser')
const cmlUtils = require('chameleon-tool-utils');
exports.injectWeexBaseStyle = function(content, self) {
  let globalStyleConfig = cml.config.get().globalStyleConfig;
  let weexCssConfig = globalStyleConfig && globalStyleConfig.weexCssConfig;
  let newcontent = content;
  let parts = parse(content);
  if (parts.styles && parts.styles.length > 1) {
    throw new Error(`${self.resourcePath} statement ${parts.styles.length} style tag,but only allow one`)
  }

  if (parts.styles && parts.styles.length === 1) {
    let contentStart = parts.styles[0].start;
    let contentEnd = parts.styles[0].end;
    let globalStyle = `\n@import 'chameleon-runtime/src/platform/weex/style/index.css';\n`;
    let injectCssContent = '';
    if(weexCssConfig &&  weexCssConfig.weexCssPath && cmlUtils.isFile(weexCssConfig.weexCssPath)){
      globalStyle = `${globalStyle} @import '${weexCssConfig.weexCssPath}';\n`
    }
    if(weexCssConfig && weexCssConfig.injectCss && Array.isArray(weexCssConfig.injectCss)){
      let injectConfig = weexCssConfig.injectCss.find((item) => item.componentPath === self.resourcePath);
      injectConfig && (injectCssContent = `\n@import '${injectConfig.cssPath}';\n`);
    }
    newcontent = content.slice(0, contentStart) + globalStyle + content.slice(contentStart,contentEnd) + injectCssContent + content.slice(contentEnd);
  }
  return newcontent;
}
exports.webAddStyleScope = function(content, self) {
  let newcontent = content;
  let parts = parse(content);
  if (parts.styles && parts.styles.length > 1) {
    throw new Error(`${self.resourcePath} statement ${parts.styles.length} style tag,but only allow one`)
  }

  if (parts.styles && parts.styles.length === 1) {
    let part = parts.styles[0];
    if (!part.scoped) {
      let styleTag = content.slice(part.tagStart, part.start);
      const styleReg = /\s*<\s*style([\s\S]*)/g
      styleTag = styleTag.replace(styleReg, function(matches, $1) {
        return `<style scoped ${$1}`
      });
      newcontent = content.slice(0, part.tagStart) + styleTag + content.slice(part.start);
    }
  }
  return newcontent;
}
