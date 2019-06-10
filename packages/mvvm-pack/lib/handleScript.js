const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const t = require('@babel/types');
const {parsePlugins} = require('runtime-check');
const {chameleonHandle} = require('chameleon-webpack-plugin/lib/utils');
const generator = require("@babel/generator");

exports.handleScript = function(source, cmlmodule) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: parsePlugins
  });

  traverse["default"](ast, {
    enter: (path) => {
      exports.replaceJsModId(source, cmlmodule, path)
    }
  })

  return generator["default"](ast).code;
}

exports.replaceJsModId = function(source, cmlmodule, path) {

  let node = path.node;
  if (t.isImportDeclaration(node) && node.source.value) {
    let modId = getJSModId(node.source.value);
    node.source.value = modId;
    node.source.raw = `'${modId}'`;

  }
  if (t.isVariableDeclaration(node)) {
    node.declarations.forEach(item => {
      if (item && item.init && item.init.callee && item.init.callee.name === 'require' && item.init.arguments && item.init.arguments[0] && item.init.arguments[0].value) {
        let modId = getJSModId(item.init.arguments[0].value);
        item.init.arguments[0].value = modId;
        item.init.arguments[0].raw = `'${modId}'`;
      }
    })
  }
  if (t.isExpressionStatement(node) && node.expression && node.expression.callee && node.expression.callee.name === 'require' && node.expression.arguments && node.expression.arguments[0]) {
    let modId = getJSModId(node.expression.arguments[0].value);
    node.expression.arguments[0].value = modId;
    node.expression.arguments[0].raw = `'${modId}'`;
  }
  function getJSModId(rawRequest) {
    let deps = cmlmodule.dependencies;
    for (let i = 0; i < deps.length; i++) {
      let dep = deps[i];
      if (rawRequest === dep.request) {
        if (dep.module && dep.module.request) {
          return exports.chameleonIdHandle(dep.module.id + '')
        }
      }
    }
    cml.log.error('not find modId for' + rawRequest);
  }
} 

exports.chameleonIdHandle = function(id) {
  let result = chameleonHandle(id, 'chameleon-tool');
  return result
}