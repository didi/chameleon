
const cmlUtils = require('chameleon-tool-utils');

module.exports = function(loaderContext, jsonObject, cmlType) {
  var jsonPath = loaderContext.resourcePath.replace(/(\.cml|\.wx\.cml|\.alipay\.cml|\.baidu\.cml)$/, '.json')
  var context = (loaderContext._compiler && loaderContext._compiler.context) || loaderContext.options.context || process.cwd()

  if (jsonObject.usingComponents) {
    let components = jsonObject.usingComponents;
    Object.keys(components).forEach(key => {
      let {filePath, refUrl} = cmlUtils.handleComponentUrl(context, loaderContext.resourcePath, components[key], cmlType);
      if (filePath) {
        components[key] = refUrl;
      } else {
        delete components[key];
        cmlUtils.log.error(`can't find component:${refUrl} in ${loaderContext.resourcePath}`);
      }
    })
  }
  cmlUtils.addNpmComponents(jsonObject, jsonPath, cmlType, context)
  

  return jsonObject;


}
