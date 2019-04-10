const loaderUtils = require('loader-utils')
const cmlUtils = require('chameleon-tool-utils');


module.exports = function(source) {
  const rawOptions = loaderUtils.getOptions(this) || {};
  let {partType} = rawOptions;

  let parts = cmlUtils.splitParts({content: source});
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
      break;
    case 'json':
      parts.script.forEach(item => {
        if (item.cmlType === 'json') {
          output = item.content;
        }
      })
      break;
    default:
      break;
  }
  return output;
}