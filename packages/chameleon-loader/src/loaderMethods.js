
const cmlUtils = require('chameleon-tool-utils');

exports.prepareParseUsingComponents = function({loaderContext, context, originObj, cmlType}) {
  return Object.keys(originObj).map(key => {
    let value = originObj[key];
    let {filePath, refUrl} = cmlUtils.handleComponentUrl(context, loaderContext.resourcePath, value, cmlType);
    // 如果是node_modules中的refUrl中会变成npm，替换成/node_modules/后再查找组件
    if (~value.indexOf('/npm') && filePath === '') {
      value = value.replace(/(.*?)npm\//g, '/node_modules/');
      filePath = cmlUtils.handleComponentUrl(context, loaderContext.resourcePath, value, cmlType).filePath;
    }
    return {
      tagName: key,
      refUrl,
      filePath,
      isNative: !filePath.endsWith('.cml')
    }
  })
}
