const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const t = require('@babel/types');
const {parsePlugins} = require('runtime-check');
const {chameleonHandle} = require('chameleon-webpack-plugin/lib/utils');
const generator = require("@babel/generator");

exports.handleScript = function(source, cmlmodule, definitions) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: parsePlugins
  });

  traverse["default"](ast, {
    enter: (path) => {
      exports.replaceJsModId(source, cmlmodule, path);
      exports.replaceDefines(source, cmlmodule, path, definitions);
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

  } else if (t.isCallExpression(node) && node.callee && t.isIdentifier(node.callee) && node.callee.name === 'require') {
    if (node.arguments && node.arguments.length === 1 && node.arguments[0] && t.isLiteral(node.arguments[0])) {
      let modId = getJSModId(node.arguments[0].value);
      node.arguments[0].value = modId;
      node.arguments[0].raw = `'${modId}'`;
    } else if (node.arguments && node.arguments.length === 1 && node.arguments[0] && t.isStringLiteral(node.arguments[0])) {
      let modId = getJSModId(node.arguments[0].value);
      node.arguments[0].value = modId;
    }
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


exports.getDefines = function(definitions, prefix, result) {

  return getInnerDefines(definitions, prefix, result);

  function getInnerDefines (definitions, prefix, result) {
    Object.keys(definitions).forEach((key) => {
      const code = definitions[key];
      let newPrefix = prefix ? prefix + '.' + key : key;
      if (code && typeof code === 'object') {
        getInnerDefines(code, newPrefix, result);
      } else {
        result.push({
          key: newPrefix,
          value: code
        })
      }
    })
    return result;
  }
}

exports.replaceDefines = function(source, cmlmodule, path, definitions) {
  let defineResult = [];
  exports.getDefines(definitions, '', defineResult);
  let node = path.node;

  function handleMember(memberList, node) {
    if (t.isMemberExpression(node.object)) {
      handleMember(memberList, node.object);
    } else if (t.isIdentifier(node.object)) {
      memberList.push(node.object.name);
    }
    if (t.isIdentifier(node.property)) {
      memberList.push(node.property.name);
    }
  }

  if (t.isIdentifier(node)) {
    if (!t.isMemberExpression(path.parent)) {
      // 只有一层变量
      defineResult.forEach(item => {
        if (item.key.length === 1 && item.key[0] === node.name) {
          node.name = item.value;
        }
      })
    }
  }
  // 多级变量，找到最上层的变量起点 process.env.media
  else if (t.isMemberExpression(node) && !t.isMemberExpression(path.parent)) {
    let memberList = [];
    handleMember(memberList, node);
    let tokenKey = memberList.join('.');
    defineResult.forEach(item => {
      if (item.key === tokenKey) {
        path.replaceWith(
          t.identifier(item.value)
        );
      }
    })
  }
}

exports.chameleonIdHandle = function(id) {
  let result = chameleonHandle(id, 'chameleon-tool');
  return result
}