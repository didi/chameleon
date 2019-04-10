
const loaderUtils = require('loader-utils')
const helper = require('./helper.js');
const cmlUtils = require('chameleon-tool-utils');

module.exports = function(source) {
  let output = '';
  const self = this;
  const rawOptions = loaderUtils.getOptions(this) || {};
  let {loaders, cmlType, media, check} = rawOptions;
  const resourcePath = this.resourcePath;
  // const context = (
  //   this.rootContext ||
  //   (this.options && this.options.context) ||
  //   process.cwd()
  // )

  let selectorOptions = {
    cmlType,
    media,
    check
  }
  let parts = cmlUtils.splitParts({content: source});
  if (parts.style.length > 0) {
    throw new Error(`${resourcePath} only allow has one <style></style>`)
  }

  if (parts.style && parts.style[0]) {
    let part = parts.style[0];
    let lang = part.attrs && part.attrs.lang || 'less';
    output += `
    var style = require('${helper.getPartLoaders({selectorOptions, partType: 'style', lang, loaders, resourcePath})}');
    `
  }
  output += `
      var template = require('${helper.getPartLoaders({selectorOptions, partType: 'template', loaders, resourcePath})}');
  `

  output += `
      var json = require('${helper.getPartLoaders({selectorOptions, partType: 'json', loaders, resourcePath})}');
  `

  output += `
      var script = require('${helper.getPartLoaders({selectorOptions, partType: 'script', loaders, resourcePath})}');
  `
  debugger
  return output;
}
