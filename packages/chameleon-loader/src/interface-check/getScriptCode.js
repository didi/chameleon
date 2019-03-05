const cmlUtils = require('chameleon-tool-utils');
const {getCheckCode} = require('./check.js');
const fs = require('fs');

function getScriptCode(loaderContext, cmlType, cmlCode, media, check = {}) {
  const interfacePath = loaderContext.resourcePath.replace(`.${cmlType}.cml`, '.interface')
  if (~loaderContext.resourcePath.indexOf(`.${cmlType}.cml`)) {
    // 添加interface文件作为loader的依赖 触发重新编译
    if (cmlUtils.isFile(interfacePath)) {
      loaderContext.addDependency(interfacePath);
      if (media === 'dev' && check.enable === true) {
        // 运行时校验
        let interfaceCode = fs.readFileSync(interfacePath, {encoding: 'utf-8'})
        let interfaceReg = new RegExp(`<script[\\s]+?cml-type=["']interface["'][\\s]*?>([\\s\\S]*?)<\\/script>`)
        let interfaceMaches = interfaceCode.match(interfaceReg);
        if (interfaceMaches) {
          interfaceCode = interfaceMaches[1];
        }
        try {
          cmlCode = getCheckCode(interfaceCode, cmlCode, interfacePath, loaderContext.resourcePath, cmlType, check.enableTypes);
        } catch (e) {
          // 当有语法错误 babel parse会报错，报错信息不友好，对cmlCode不处理，交给webpack对错误模块处理
        }

      }
    } else {
      throw new Error(`multimode-component can't find interface file：${interfacePath}`)
    }
  }

  return cmlCode;
}

module.exports = {
  getScriptCode
}
