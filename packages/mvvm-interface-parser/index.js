
const cmlUtils = require('chameleon-tool-utils');
const {getCode} = require('./lib/check.js');
const getInterfaceCode = require('./lib/getInterfaceCode.js');
const getMethodCode = require('./lib/getMethodCode.js');
const path = require('path');

const defaultResolve = function(filePath, relativePath) {
  return path.resolve(path.dirname(filePath), relativePath)
}

// resolve 用于处理interface中include文件中的引用
module.exports = function({cmlType, media, source, filePath, check, resolve = defaultResolve }) {
  let interfaceResut = getInterfaceCode({interfacePath: filePath, content: source})
  let methodResult = getMethodCode({interfacePath: filePath, content: source, cmlType, resolve})

  let {content: interfaceContent, devDeps: interfacedevDeps} = interfaceResut;
  let {content: methodContent, devDeps: methoddevDeps} = methodResult;
  let devDeps = [].concat(interfacedevDeps).concat(methoddevDeps);
  if (!interfaceContent) {
    throw new Error(`文件: ${filePath}未定义<script cml-type="interface"></script>`)
  }
  if (!methodContent) {
    throw new Error(`文件: ${filePath}未定义<script cml-type="${cmlType}"></script>`)
  }
  let result = `
  ${interfaceContent}
  ${methodContent}
  `;

  if (media === 'dev' && check.enable === true) {
    try {
      result = getCode(result, {
        cmlType,
        filePath,
        enableTypes: check.enableTypes || []
      });
    } catch (e) {
      // 当有语法错误 babel parse会报错，报错信息不友好
      cmlUtils.log.error(`mvvm-interface-parser: ${filePath} syntax error！`)
    }
  }

  // 将对象原型上的方法属性拷贝到对象上 解决...扩展运算符取不到值的问题
  const copyProtoProperty = `
  function copyProtoProperty(obj = {}) {
    let EXPORT_OBJ = obj;
    let EXPORT_PROTO = EXPORT_OBJ.__proto__;
  
    if (EXPORT_PROTO.constructor !== Object) {
      Object.getOwnPropertyNames(EXPORT_PROTO).forEach(key => {
        if (!/constructor|prototype|length/ig.test(key)) {
          // 原型上有自身没有的属性 放到自身上
          if (!EXPORT_OBJ.hasOwnProperty(key)) {
            EXPORT_OBJ[key] = EXPORT_PROTO[key]
          }
        }
      })
    }
  
    return EXPORT_OBJ;
  }
  copyProtoProperty(exports.default)
  `
  result = `
    ${result}
    ${copyProtoProperty}
  `
  return {result, devDeps};
}
