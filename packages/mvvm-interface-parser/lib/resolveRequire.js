const parser = require('../../mvvm-script-parser/node_modules/@babel/parser/typings/babel-parser');
const traverse = require('@babel/traverse');
const t = require('@babel/types');
const generator = require("../../mvvm-script-parser/node_modules/@babel/generator/lib");
const {parsePlugins} = require('../../mvvm-script-parser/node_modules/runtime-check');
const cmlUtils = require('../../mvvm-script-parser/node_modules/chameleon-tool-utils/src');

// resolve 解析路径的方法
exports.resolveRequire = function({content, filePath, resolve}) {
  let ast = exports.getAST(content);
  exports.replaceRequire({ast, filePath, resolve});
  return generator["default"](ast).code;
}

// 获取dependencies
exports.replaceRequire = function({ast, filePath, resolve}) {
  traverse["default"](ast, {
    enter: (path) => {
      let node = path.node;
      if (t.isImportDeclaration(node) && node.source.value) {
        let realPath = resolve(filePath, node.source.value);
        if (cmlUtils.isFile(realPath)) {
          node.source.value = realPath;
          node.source.raw = `'${realPath}'`;
        }
      }
      if (t.isVariableDeclaration(node)) {
        node.declarations.forEach(item => {
          if (item && item.init && item.init.callee && item.init.callee.name === 'require' && item.init.arguments && item.init.arguments[0] && item.init.arguments[0].value) {
            let realPath = resolve(filePath, item.init.arguments[0].value);
            if (cmlUtils.isFile(realPath)) {
              item.init.arguments[0].value = realPath;
              item.init.arguments[0].raw = `'${realPath}'`;
            }
          }
        })
      }
      if (t.isExpressionStatement(node) && node.expression && node.expression.callee && node.expression.callee.name === 'require' && node.expression.arguments && node.expression.arguments[0]) {
        let realPath = resolve(filePath, node.expression.arguments[0].value);
        if (cmlUtils.isFile(realPath)) {
          node.expression.arguments[0].value = realPath;
          node.expression.arguments[0].raw = `'${realPath}'`;
        }
      }
    }
  })
}

// 获取ast
exports.getAST = function(content) {
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: parsePlugins
  });
  return ast;
}
