const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const generate = require("@babel/generator");
const {getDefines, parsePlugins} = require('runtime-check');
const path = require('path');
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
        let codeSeg = exportCode.code.replace(declarationCode.code, '__OBJECT__WRAPPER__(' + declarationCode.code + ', __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__ )');
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
 * 获取处理后的代码
 *
 * @param  {string} code 代码片段
 * @return {string}      代码片段
 */
const getCode = function (code, options) {
  let {filePath, cmlType, enableTypes} = options;
  const defines = getDefines(code, filePath);
  /* eslint-disable no-magic-numbers */
  const defineStr = JSON.stringify(defines.defines, null, 2);
  /* eslint-disable no-magic-numbers */
  const newCode = generate["default"](handlExport(defines.ast)).code;

  let result = '';
  let wrapperCode = '';
  if (filePath) {
    filePath = path.resolve(filePath);
    filePath = cmlUtils.handleWinPath(filePath);
    result += `const __INTERFACE__FILEPATH="${filePath}"`;
  }
  /* eslint-disable no-inner-declarations */
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
  const wrapperPath = path.join(__dirname, '../runtime/checkWrapper.js');
  wrapperCode = `require('${cmlUtils.handleRelativePath(filePath, wrapperPath)}')`

  result += `
  const __enableTypes__ = "${enableTypes}"
  const __CHECK__DEFINES__ = ${defineStr};
  const __OBJECT__WRAPPER__ = ${wrapperCode};
  ${newCode}
  `;
  return result;
};

module.exports = {
  getCode
};
