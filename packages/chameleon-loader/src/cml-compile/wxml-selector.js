/* 这个文件用来处理原生小程序组件*/

const loaderUtils = require('loader-utils');
const fs = require('fs');
const cmlUtils = require('chameleon-tool-utils');
const path = require('path');
const handlePlatformCss = require('./handle-platform-css.js');

module.exports = function(content) {
  const self = this;// eslint-disable-line
  const resource = this.resourcePath;
  const extName = path.extname(resource);
  const cssExt = {
    '.wxml': '.wxss',
    '.axml': '.acss',
    '.swan': '.css',
    '.qml': '.qss',
    '.ttml': '.ttss'
  }
  const styles = cssExt[extName];
  const query = loaderUtils.getOptions(this) || {}
  const type = query.type;
  let targetFilePath = '';
  let output = '';
  let extMap = {
    script: '.js',
    styles
  }
  // targetFilePath = resource.replace(/\.wxml/, extMap[type]);
  targetFilePath = resource.replace(new RegExp(`${extName}$`), extMap[type]);
  if (!cmlUtils.isFile(targetFilePath)) {
    throw new Error(`can't find ${targetFilePath}`)
  } else {
    self.addDependency(targetFilePath);
    output = fs.readFileSync(targetFilePath, {encoding: 'utf-8'})
  }
  if (type === 'script') {
    return `${output}\n;
    module.exports = function(){\n
    }`
  }
  if (output) {
    output = handlePlatformCss(output, {filePath: this.resourcePath, ext: styles})
  }
  return output;

}
