const parse = require('../parser')

exports.injectWeexBaseStyle = function(content, self) {
  let newcontent = content;
  let parts = parse(content);
  if (parts.styles && parts.styles.length > 1) {
    throw new Error(`${self.resourcePath}中声明了${parts.styles.length}个style部分，只允许一个。`)
  }

  if (parts.styles && parts.styles.length === 1) {
    let contentStart = parts.styles[0].start;
    const globalStyle = `\n@import 'chameleon-runtime/src/platform/weex/style/index.css';\n`;
    newcontent = content.slice(0, contentStart) + globalStyle + content.slice(contentStart);
  }
  return newcontent;
}
exports.webAddStyleScope = function(content, self) {
  let newcontent = content;
  let parts = parse(content);
  if (parts.styles && parts.styles.length > 1) {
    throw new Error(`${self.resourcePath}中声明了${parts.styles.length}个style部分，只允许一个。`)
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
