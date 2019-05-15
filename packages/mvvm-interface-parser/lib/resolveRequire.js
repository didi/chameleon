const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const t = require('@babel/types');
const generator = require("@babel/generator");
const {parsePlugins} = require('runtime-check');
const cmlUtils = require('chameleon-tool-utils');

// resolve 解析路径的方法
exports.resolveRequire = function({content, oldFilePath, newFilePath}) {
  let resolve = cmlUtils.resolveInterfaceRequire;
  let ast = exports.getAST(content);
  exports.replaceRequire({ast, oldFilePath, newFilePath, resolve});
  return generator["default"](ast).code;
}

// 获取dependencies
exports.replaceRequire = function({ast, oldFilePath, newFilePath, resolve}) {
  traverse["default"](ast, {
    enter: (path) => {
      let node = path.node;
      if (t.isImportDeclaration(node) && node.source.value) {
        let realPath = resolve(oldFilePath, newFilePath, node.source.value);
        node.source.value = realPath;
        node.source.raw = `'${realPath}'`;
      }
      if (t.isVariableDeclaration(node)) {
        node.declarations.forEach(item => {
          if (item && item.init && item.init.callee && item.init.callee.name === 'require' && item.init.arguments && item.init.arguments[0] && item.init.arguments[0].value) {
            let realPath = resolve(oldFilePath, newFilePath, item.init.arguments[0].value);
            item.init.arguments[0].value = realPath;
            item.init.arguments[0].raw = `'${realPath}'`;
          }
        })
      }
      if (t.isExpressionStatement(node) && node.expression && node.expression.callee && node.expression.callee.name === 'require' && node.expression.arguments && node.expression.arguments[0]) {
        let realPath = resolve(oldFilePath, newFilePath, node.expression.arguments[0].value);
        node.expression.arguments[0].value = realPath;
        node.expression.arguments[0].raw = `'${realPath}'`;
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
