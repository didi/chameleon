/**
 * 针对小程序的loader 将小程序文件结构变成cml文件结构
 */
const loaderUtils = require('loader-utils');
const helper = require('./helper.js');

module.exports = function(content) {
  let output = "";
  this._module._nodeType = "component";
  const rawOptions = loaderUtils.getOptions(this) || {};
  let {loaders, cmlType, media, mapping} = rawOptions;
  const resourcePath = this.resourcePath;
  let selectorOptions = {
    cmlType,
    media,
    mapping
  }
  output += `var template = require('${helper.getPartLoaders({selectorOptions, partType: 'template', loaders, resourcePath})}');\n`
  output += `var style = require('${helper.getPartLoaders({selectorOptions, partType: 'style', lang: 'css', loaders, resourcePath})}');\n`
  output += `var json = require('${helper.getPartLoaders({selectorOptions, partType: 'json', loaders, resourcePath})}');\n`
  output += `var script = require('${helper.getPartLoaders({selectorOptions, partType: 'script', loaders, resourcePath})}');\n`

  return output;
}