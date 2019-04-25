const loaderUtils = require('loader-utils')
const cmlUtils = require('chameleon-tool-utils');
const { getScriptCode } = require('chameleon-loader/src/interface-check/getScriptCode.js');
const helper = require('./helper.js');


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
          let {runtimeNpmName, runtimeNeedComponents} = this._compiler._platformPlugin;
          let insertMethodMap = {
            app: 'createApp',
            page: 'createPage',
            component: 'createComponent',
          }
          let runtimeScript = '';
          // runtime方法需要组件
          if (runtimeNeedComponents) {
            let {componentFiles} = cmlInfo;
            let components = ['{'];
            let comKeys = Object.keys(componentFiles);
            comKeys.forEach((comName, index) => {
              content += `
              import ${helper.toUpperCase(comName)} from "${cmlUtils.handleRelativePath(self.resourcePath, componentFiles[comName])}"\n`;
              if (comKeys.length - 1 === index) {
                components.push(`${helper.toUpperCase(comName)}`);
              } else {
                components.push(`${helper.toUpperCase(comName)},`);
              }
            })

            components.push('}');

            runtimeScript = `
            ${runtimeNpmName}.${insertMethodMap[fileType]}(exports.default, ${components.join('')})
            `
          } else {
            runtimeScript = `
            ${runtimeNpmName}.${insertMethodMap[fileType]}(exports.default)
            `
          }

          content += runtimeScript;
          
          output = getScriptCode(self, cmlType, content, media, check);
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
      output = `module.exports = ${this._module._cmlSource}`;
      break;
    default:
      break;
  }
  return output;
}