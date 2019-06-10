
/* eslint-disable */
/**
 * cml多态组件 interface校验
 * 1 拿到interface的校验
 * 2 写好处理default对象的方法
 * 3 拼接代码
 */
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('babel-traverse');
const generate = require("babel-generator");
const {getDefines, parsePlugins} = require('runtime-check');
const cmlUtils = require('chameleon-tool-utils');

/**
 * 处理ast导出表达式
 *
 * @param  {Object} ast ast
 * @return {Object}     ast
 */
const handlExport = function (ast) {
  traverse["default"](ast, {
    enter(path) {
      if (path.node.type === 'ExportDefaultDeclaration') {
        // 拿到export ddefault new Method(); 这一行代码
        let exportCode = generate["default"](path.node);
         // 拿到 new Method(); 这一段代码
        let declarationCode = generate["default"](path.node.declaration);
        // 得到 export default __OBJECT__WARPPER__(new Method());
        let codeSeg = exportCode.code.replace(declarationCode.code, '__CML__WRAPPER__(' + declarationCode.code + ', __CML_ERROR__, __enableTypes__, __INTERFAE__DEFINES__, __CML__DEFINES__)');
        // 转成ast
        let replacement = parser.parse(codeSeg, {
          plugins: parsePlugins,
          sourceType: 'module'
        });
        traverse["default"].removeProperties(replacement);
        // 替换
        path.replaceWith(replacement.program.body[0]);
        path.stop();
      }
    }
  });

  return ast;
};

/**
 *
 * @param {*} interfaceCode interface的代码
 * @param {*} cmlCode cml的代码
 * @param {*} interfacePath interface的文件路径
 * @param {*} cmlPath  cml的文件路径
 * @param {*} cmlType  web  weex
 * @param {*} enableTypes  启动的类型
 */
function getCheckCode(interfaceCode, cmlCode, interfacePath, cmlPath, cmlType, enableTypes) {
  let interfaceDefines = getDefines(interfaceCode, interfacePath).defines;
  let interfaceNumber = Object.keys(interfaceDefines.interfaces).length;
  if (interfaceNumber === 0) {
    throw new Error(`${interfacePath}中未定义interface`)
  } else if (interfaceNumber > 1) {
    throw new Error(`${interfacePath}中只能定义一个interface`)
  }

  // 为了拿到expot 对象的class implements 的interface
  let cmlDefines = getDefines(cmlCode, cmlPath);

  const newCode = generate["default"](handlExport(cmlDefines.ast)).code;
  let result = '';
  let wrapperCode = '';
  if (interfacePath) {
    interfacePath = path.resolve(interfacePath);
    interfacePath = cmlUtils.handleWinPath(interfacePath);

    result += `const __INTERFACE__FILEPATH="${interfacePath}"`;
  }
  if (cmlType === 'weex') {
    function throwError(content) {
      var modal = weex.requireModule('modal')
      modal.alert({
        message: `文件位置: ${__INTERFACE__FILEPATH}
                   ${content}`
      })
    }
    result += `
      const __CML_ERROR__ = ${throwError.toString()}
    `
  } else {
    function throwError(content) {
      throw new Error(`文件位置: ${__INTERFACE__FILEPATH}
            ${content}`)
    }
    result += `
      const __CML_ERROR__ = ${throwError.toString()}
    `
  }

  const checkPath = path.resolve(__dirname, '../runtime/check.js');

  result += `
    const __enableTypes__ = ${JSON.stringify(enableTypes)}
    const __INTERFAE__DEFINES__ = ${JSON.stringify(interfaceDefines, null, 2)};
    const __CML__DEFINES__ = ${JSON.stringify(cmlDefines.defines, null, 2)};
    const __CML__WRAPPER__ = require('${cmlUtils.handleRelativePath(cmlPath, checkPath)}');
    ${newCode}
  `
  return result;

}

module.exports = {
  getCheckCode
}


