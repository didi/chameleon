const loaderUtils = require('loader-utils')
const cmlUtils = require('chameleon-tool-utils');


module.exports = function(source) {
  const rawOptions = loaderUtils.getOptions(this) || {};
  const resourcePath = this.resourcePath;
  let {partType, cmlType, fileType} = rawOptions;
  const context = (
    this.rootContext ||
    (this.options && this.options.context) ||
    process.cwd()
  )
  let parts = cmlUtils.splitParts({content: source});
  this._module._nodeType = 'module';
  this._module._moduleType = partType;
  this._module._parentNodeType = fileType;

  let output = '';
  switch (partType) {
    case 'style':
      output = parts.style[0].content;
      break;
    case 'script':
      parts.script.forEach(item => {
        if (item.cmlType !== 'json') {
          output = item.content;
        }
      })
      break;
    case 'template':
      output = parts.template && parts.template[0] && parts.template[0].content;
      this._module._cmlSource = output;
      output = `module.exports = ${JSON.stringify(output)}`;

      break;
    case 'json':
      var jsonObject = cmlUtils.getJsonFileContent(resourcePath, cmlType);
      cmlUtils.addNpmComponents(jsonObject, resourcePath, cmlType, context);
      output = JSON.stringify(jsonObject);
      this._module._cmlSource = output;
      output = `module.exports = ${JSON.stringify(output)}`;
      break;
    default:
      break;
  }
  return output;
}