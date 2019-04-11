
const loaderUtils = require('loader-utils')
const helper = require('./helper.js');
const cmlUtils = require('chameleon-tool-utils');
const path = require('path');

module.exports = function(source) {
  this._module._cmlSource = source;
  let output = '';
  const self = this;
  const rawOptions = loaderUtils.getOptions(this) || {};
  let {loaders, cmlType, media, check} = rawOptions;
  const resourcePath = this.resourcePath;
  const context = (
    this.rootContext ||
    (this.options && this.options.context) ||
    process.cwd()
  )
  let fileType = cmlUtils.getCmlFileType(resourcePath, context, cmlType);

  let selectorOptions = {
    cmlType,
    media,
    check,
    fileType
  }
  let parts = cmlUtils.splitParts({content: source});
  if (parts.style.length > 1) {
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
  this._module._nodeType = fileType;
  // app的依赖是page
  if (fileType === 'app') {
    self.addDependency(path.join(context, './src/router.config.json'));
    let {routerConfig, hasError} = cmlUtils.getRouterConfig();
    if (hasError) {
      throw new Error('router.config.json read error')
    } else {
      routerConfig.routes.forEach(item => {
        output += ` require("$PROJECT/src${item.path}.cml").default`
      })
    }
  } else {
  // page和component的是usingComponent
    let jsonObject = cmlUtils.getJsonFileContent(resourcePath, cmlType);
    let coms = jsonObject.usingComponents || {};

    Object.keys(coms).forEach(comKey => {
      let comPath = coms[comKey];
      let { filePath } = cmlUtils.handleComponentUrl(context, self.resourcePath, comPath, cmlType);
      if (filePath) {
        output += `
        import ${helper.toUpperCase(comKey)} from "${cmlUtils.handleRelativePath(self.resourcePath, filePath)}" 
        `
      } else {
        cmlUtils.log.error(`can't find component:${comPath} in ${self.resourcePath} `);
      }
    })

    let npmComponents = cmlUtils.getTargetInsertComponents(self.resourcePath, cmlType, context) || [];
    // node_modules 中的组件引入
    npmComponents.forEach(item => {
      output += `import ${helper.toUpperCase(item.name)} from "${cmlUtils.handleRelativePath(self.resourcePath, item.filePath)}" \n`
    })

  }
  return output;
}
