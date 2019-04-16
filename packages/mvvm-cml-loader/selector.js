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
          this.compiler._mvvmCompiler.emit('insert-script', {  // 触发用户插入
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
      output = `module.exports = ''`;

      break;
    case 'json':
      this._module._cmlSource = cmlInfo.compiledJson || {};
      output = `module.exports = ''`;
      break;
    default:
      break;
  }
  return output;
}