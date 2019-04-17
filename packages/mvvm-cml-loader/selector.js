const loaderUtils = require('loader-utils')
const cmlUtils = require('chameleon-tool-utils');
const { getScriptCode } = require('chameleon-loader/src/interface-check/getScriptCode.js');


module.exports = function(source) {
  const self = this;
  const rawOptions = loaderUtils.getOptions(this) || {};
  const resourcePath = this.resourcePath;
  let {partType, cmlType, fileType, media, check} = rawOptions;
  const context = (
    this.rootContext ||
    (this.options && this.options.context) ||
    process.cwd()
  )
  let parts = cmlUtils.splitParts({content: source});
  this._module._nodeType = 'module';
  this._module._moduleType = partType;
  this._module._parentNodeType = fileType;

  let cmlInfo = this._compiler._mvvmCmlInfo[this.resourcePath];

  let output = '';
  switch (partType) {
    case 'style':
      output = parts.style[0].content; // 交给后面loader
      break;
    case 'script':
      parts.script.forEach(item => {  // 交给后面loader
        if (item.cmlType !== 'json') {
          let content = item.content;
          let result = {
            content
          }
          this._compiler._mvvmCompiler.emit('insert-script', {  // 触发用户插入
            nodeType: fileType,
            resourcePath,
            componentFiles: cmlInfo.componentFiles,
            compiledJson: cmlInfo.compiledJson || {}
          }, result);
          result.content = getScriptCode(self, cmlType, result.content, media, check);
        }
      })
      break;
    case 'template':
      this._module._cmlSource = cmlInfo.compiledTemplate || '';
      this._module._nativeComponents = cmlInfo.nativeComponents || [];
      this._module._currentUsedBuildInTagMap = cmlInfo.currentUsedBuildInTagMap || [];
      
      output = `module.exports = ${JSON.stringify(cmlInfo.compiledTemplate)}`;

      break;
    case 'json':
      this._module._cmlSource = JSON.stringify(cmlInfo.compiledJson || {});
      output = `module.exports = ${JSON.stringify(cmlInfo.compiledJson)}`;
      break;
    default:
      break;
  }
  return output;
}