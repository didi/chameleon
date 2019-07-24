
const loaderUtils = require('loader-utils')
const helper = require('./helper.js');
const cmlUtils = require('chameleon-tool-utils');
const path = require('path');
const {vueToCml: templateParse} = require('mvvm-template-parser');
const {prepareParseUsingComponents} = require('chameleon-loader/src/loaderMethods.js');
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
    var style = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'style', lang, loaders, resourcePath})});
    `
  }
  output += `var template = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'template', loaders, resourcePath})});\n`
  output += `var json = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'json', loaders, resourcePath})});\n`
  output += `var script = require(${helper.getPartLoaders({loaderContext: self, selectorOptions, partType: 'script', loaders, resourcePath})});\n`
  this._module._nodeType = fileType;
  // app添加page依赖
  if (fileType === 'app') {
    self.addDependency(path.join(context, './src/router.config.json'));
    let {routerConfig, hasError} = cmlUtils.getRouterConfig();
    if (hasError) {
      throw new Error('router.config.json read error')
    } else {
      routerConfig.routes.forEach(item => {
        output += ` require("$PROJECT/src${item.path}.cml").default;`
      })
    }

    // subProject 中的页面
    let subProject = cml.config.get().subProject;
    if (subProject && subProject.length > 0) {
      subProject.forEach(function(item) {
        let npmName = cmlUtils.isString(item) ? item : item.npmName;
        let npmRouterConfig = cml.utils.readsubProjectRouterConfig(cml.projectRoot, npmName);
        npmRouterConfig.routes && npmRouterConfig.routes.forEach(item => {
          let cmlFilePath = path.join(cml.projectRoot, 'node_modules', npmName, 'src', item.path + '.cml');
          output += `require("${cmlFilePath}").default`;
        })
      })
    }
  }

  let jsonObject = cmlUtils.getJsonFileContent(resourcePath, cmlType);
  let coms = jsonObject.usingComponents = jsonObject.usingComponents || {};
  let customComKeys = Object.keys(coms); // 用户自定义组件key
  let usingComponentsAndFilePath = {}; // 记录文件依赖的组件名称及文件位置
  let usingComponents = prepareParseUsingComponents({loaderContext: self, context, originObj: coms, cmlType});

  const isBuildInFile = cmlUtils.isBuildIn(self.resourcePath, cmlType, context);
  
  let buildInComponents = {};
  // 内置组件库中的cml文件不进行内置组件的替换
  if (!isBuildInFile) {
    buildInComponents = cmlUtils.getBuildinComponents(cmlType, context).compileTagMap;
  }
  let parseTemplate = parts.template && parts.template[0];
  let templateContent = (parseTemplate && parseTemplate.content) || '';

  let {source: compiledTemplate, usedBuildInTagMap} = templateParse(templateContent, {
    buildInComponents, // 对内置组件做替换 并返回用了哪个内置组件
    usingComponents // 判断是否是原生组件
  });
  const currentUsedBuildInTagMap = {};

  // currentUsedBuildInTagMap 中 key为  cml-builtin-button
  Object.keys(usedBuildInTagMap).forEach(key =>{
    let value = usedBuildInTagMap[key];
    currentUsedBuildInTagMap[value] = key;
  })

  // 先遍历usingComponents中的
  Object.keys(coms).forEach(key => {
    let {filePath, refUrl} = cmlUtils.handleComponentUrl(context, self.resourcePath, coms[key], cmlType);
    if (filePath) {
      coms[key] = refUrl;
      usingComponentsAndFilePath[key] = filePath;
      // 建立依赖进行编译
      output += `
        import ${helper.toUpperCase(key)} from "${cmlUtils.handleRelativePath(self.resourcePath, filePath)}"\n`;

    } else {
      if (coms[key].indexOf('plugin://') !== 0) {
        delete coms[key];
        cmlUtils.log.error(`can't find component:${coms[key]} in ${self.resourcePath}`);
      }
    }
  })

  let npmComponents = cmlUtils.getTargetInsertComponents(self.resourcePath, cmlType, context) || [];
  npmComponents = npmComponents.filter(item => {
    // 如果是内置组件 选择模板中使用了的组件
    if (item.isBuiltin) {
      return !!currentUsedBuildInTagMap[item.name];
      // 如果是其他的npm库组件 选择与用户自定义名称不同的组件
    } else if (!~customComKeys.indexOf(item.name)) {
      return true;
    }
  })

  npmComponents.forEach(item => {
    output += `import ${helper.toUpperCase(item.name)} from "${cmlUtils.handleRelativePath(self.resourcePath, item.filePath)}" \n`;
    usingComponentsAndFilePath[item.name] = item.filePath;
    let refPath = cmlUtils.npmRefPathToRelative(item.refPath, self.resourcePath, context);
    coms[item.name] = refPath;
  })

  Object.keys(coms).forEach(key => {
    coms[key] = cmlUtils.handleSpecialChar(coms[key])
  });


  this._compiler._mvvmCmlInfo = this._compiler._mvvmCmlInfo || {};

  this._compiler._mvvmCmlInfo[self.resourcePath] = {
    compiledTemplate,
    usingComponents,
    currentUsedBuildInTagMap,
    compiledJson: jsonObject,
    componentFiles: usingComponentsAndFilePath
  }
  this._module._cmlExtra = {
    componentFiles: usingComponentsAndFilePath
  }
  return output;
}
