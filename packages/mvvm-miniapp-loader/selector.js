

const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');
module.exports = function() {
  const self = this;
  let output = '';
  const rawOptions = loaderUtils.getOptions(this) || {};
  const resourcePath = this.resourcePath;
  let {mapping, partType} = rawOptions;
  this._module._nodeType = 'module';
  this._module._moduleType = partType;
  this._module._parentNodeType = 'components';
  let partFilePath = resourcePath.replace(path.extname(resourcePath), mapping[partType]);
  self.addDependency(partFilePath);

  switch (partType) {
    case 'json':
      this._module._cmlSource = JSON.stringify(JSON.parse(fs.readFileSync(partFilePath, {encoding: 'utf8'})) || {}, '', 4);
      output = `module.exports = ${this._module._cmlSource}`;
      break;
    case 'template':
      this._module._cmlSource = fs.readFileSync(partFilePath, {encoding: 'utf8'});
      output = `module.exports = ${JSON.stringify(this._module._cmlSource)}`;
      break;
    case 'script':
    case 'style':
      output = fs.readFileSync(partFilePath, {encoding: 'utf8'});
      break;
    default:
      break;
  }

  return output;

}
