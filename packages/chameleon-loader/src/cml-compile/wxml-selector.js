

const loaderUtils = require('loader-utils');
const fs = require('fs');
const cmlUtils = require('chameleon-tool-utils');

module.exports = function(content) {
  const self = this;
  const resource = this.resourcePath;
  const query = loaderUtils.getOptions(this) || {}
  const type = query.type;
  let targetFilePath = '';
  let output = '';
  let extMap = {
    script: '.js',
    styles: '.wxss'
  }
  targetFilePath = resource.replace(/\.wxml/, extMap[type]);
  if (!cmlUtils.isFile(targetFilePath)) {
    throw new Error(`未找到文件${targetFilePath}`)
  } else {
    self.addDependency(targetFilePath);
    output = fs.readFileSync(targetFilePath, {encoding: 'utf-8'})
  }
  return output;

}
