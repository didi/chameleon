const fs = require('fs');
const path = require('path');
const config = require('../../config');
const Parser = require('cml-component-parser');
const parser = new Parser(null, config.getParserConfig().script);

let _builtinCompsInfo = {
  name: '', version: '', components: {}
};

function getBuiltinVersion() {
  let packDir = config.getCurrentWorkspace() + '/node_modules/chameleon-ui-builtin';
  let packageJsonFile = path.resolve(packDir, 'package.json');
  if (fs.existsSync(packageJsonFile)) {
    let fileRawContent = fs.readFileSync(packageJsonFile, 'utf8');
    let jsonObj = JSON.parse(fileRawContent);

    if (jsonObj.version && jsonObj.name) {
      return {
        name: jsonObj.name,
        version: jsonObj.version
      }
    }
  }
  return null;
}

function isPackageUpdated() {
  let pakcageInfo = getBuiltinVersion();
  if (pakcageInfo && pakcageInfo.version === _builtinCompsInfo.version && pakcageInfo.name === _builtinCompsInfo.name) {
    return false;
  }
  if (pakcageInfo) {
    _builtinCompsInfo.name = pakcageInfo.name;
    _builtinCompsInfo.version = pakcageInfo.version;
  }
  return true;
}

function getBuiltinComponents() {
  let result = {};
  let inDir = config.getCurrentWorkspace() + '/node_modules/chameleon-ui-builtin/components';
  
  if (fs.existsSync(inDir)) {
    Parser.flatEntrance(inDir).forEach(filterFile => {
      let content = parser.resetPath(filterFile).getJsonResultsWithComponentName();
      content && (result[content.name] = content.content);
    });
  }
  _builtinCompsInfo.components = result;
  return result; 
}

function getStoredComponentInfo() {
  return _builtinCompsInfo.components;
}

module.exports.getCml = function () {
  // check package version of built-in components
  if (isPackageUpdated()) {
    return getBuiltinComponents();
  }
  return getStoredComponentInfo();
}

module.exports.getBuiltinTags = function () {
  let componentInfo = this.getCml();
  return Object.keys(componentInfo);
}
