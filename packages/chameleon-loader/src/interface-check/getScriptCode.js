const cmlUtils = require('chameleon-tool-utils');
const getInterfaceCode = require('mvvm-interface-parser/lib/getInterfaceCode.js');
const {getCheckCode} = require('./check.js');

function getScriptCode(loaderContext, cmlType, cmlCode, media, check = {}) {
  let cmlPath = loaderContext.resourcePath;
  // 多态cml组件获取接口校验部分代码  不根据文件名称判断 只能根据是否有interface文件
  if (media === 'dev' && check.enable === true) {
    let interfacePath = cmlUtils.RecordCml2Interface[cmlPath];
    // 如果有interface文件
    if (interfacePath) {
      let {content: interfaceCode, devDeps: interfaceDevDeps, contentFilePath} = getInterfaceCode({interfacePath});
      interfaceDevDeps.forEach(item => {
        loaderContext.addDependency(item);
      })
      try {
        cmlCode = getCheckCode(interfaceCode, cmlCode, contentFilePath, cmlPath, cmlType, check.enableTypes);
      } catch (e) {
        // 当有语法错误 babel parse会报错，报错信息不友好
        cmlUtils.log.error(`chameleon-loader: ${cmlPath} or ${contentFilePath} syntax error！`)
      }
    }
  }
  return cmlCode;
}

module.exports = {
  getScriptCode
}
