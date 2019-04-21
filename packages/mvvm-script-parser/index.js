/** 编译源码
 * 分析依赖
 * */
'use strict';

const {parsePlugins} = require('runtime-check');
const parser = require('@babel/parser');
const babel = require('@babel/core');
const traverse = require('@babel/traverse');
const t = require('@babel/types');
const cmlUtils = require('chameleon-tool-utils');
const {getCheckCode} = require('./lib/check');
const interfaceParser = require('mvvm-interface-parser');
const getInterfaceCode = require('mvvm-interface-parser/lib/getInterfaceCode.js');
const generator = require("@babel/generator");
const path = require('path');

const defaultResolve = function(filePath, relativePath) {
  return path.resolve(path.dirname(filePath), relativePath)
}
// 标准的script部分处理
exports.standardParser = function({cmlType, media, source, filePath, check, resolve = defaultResolve }) {
  let devDeps = [];
  let reg = new RegExp(`\\.${cmlType}\\.cml$`);

  // 多态组件 获取interface文件并拼接
  if (reg.test(filePath)) {
    let interfacePath = cmlUtils.RecordCml2Interface[filePath];
    if (!interfacePath) {
      throw new Error(`not find interface for ${filePath}`)
    }
    let {content: interfaceCode, devDeps: interfaceDevDeps, contentFilePath} = getInterfaceCode({interfacePath});
    devDeps = interfaceDevDeps;
    if (media === 'dev' && check.enable === true) {
      try {
        source = getCheckCode(interfaceCode, source, contentFilePath, filePath, cmlType, check.enableTypes);
      } catch (e) {
        // 当有语法错误 babel parse会报错，报错信息不友好
        cmlUtils.log.error(`mvvm-interface-parser: ${filePath} or ${contentFilePath} syntax error！`)
      }
    }
  }
  // .interface文件
  else if (/\.interface$/.test(filePath)) {
    let interfaceResult = interfaceParser({cmlType, media, source, filePath, check, resolve });
    source = interfaceResult.result;
    devDeps = interfaceResult.devDeps;
  }
  return {source, devDeps};

}


// 源代码的ast
exports.JSCompile = function({source, filePath, compiler}) {
  const ast = exports.getAST({source});
  const dependencies = exports.getDependenciesAndReplace({ast, filePath, compiler});
  const output = generator["default"](ast);
  return {
    ast,
    dependencies,
    output
  };
}

// 获取ast
exports.getAST = function({source}) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: parsePlugins
  });
  return ast;
}

// 获取dependencies
exports.getDependenciesAndReplace = function({ast, filePath, compiler}) {
  let dependencies = [];
  traverse["default"](ast, {
    enter: (path) => {
      let node = path.node;
      if (t.isImportDeclaration(node) && node.source.value) {
        let {realPath, modId} = getJSModId(node.source.value);
        node.source.value = modId;
        node.source.raw = `'${modId}'`;
        dependencies.push(realPath);

      }
      if (t.isVariableDeclaration(node)) {
        node.declarations.forEach(item => {
          if (item && item.init && item.init.callee && item.init.callee.name === 'require' && item.init.arguments && item.init.arguments[0] && item.init.arguments[0].value) {
            let {realPath, modId} = getJSModId(item.init.arguments[0].value);
            item.init.arguments[0].value = modId;
            item.init.arguments[0].raw = `'${modId}'`;
            dependencies.push(realPath);
          }
        })
      }
      if (t.isExpressionStatement(node) && node.expression && node.expression.callee && node.expression.callee.name === 'require' && node.expression.arguments && node.expression.arguments[0]) {
        let {realPath, modId} = getJSModId(node.expression.arguments[0].value);
        node.expression.arguments[0].value = modId;
        node.expression.arguments[0].raw = `'${modId}'`;
        dependencies.push(realPath);
      }
    }
  })

  function getJSModId(dependPath) {
    if (compiler) {
      let realDependPath = compiler.resolve(filePath, dependPath);
      return {
        realPath: realDependPath,
        modId: compiler.createModId(realDependPath)
      };
    } else {
      return {
        realPath: dependPath,
        modId: dependPath
      }
    }
  }
  return dependencies;
}


// 获取dependencies
exports.getDependencies = function({ast}) {
  let dependencies = [];
  traverse["default"](ast, {
    enter: (path) => {
      let node = path.node;
      if (t.isImportDeclaration(node) && node.source.value) {
        dependencies.push(node.source.value);
      }
      if (t.isVariableDeclaration(node)) {
        node.declarations.forEach(item => {
          if (item && item.init && item.init.callee && item.init.callee.name === 'require' && item.init.arguments && item.init.arguments[0] && item.init.arguments[0].value) {
            dependencies.push(item.init.arguments[0].value);
          }
        })
      }
      if (t.isExpressionStatement(node) && node.expression && node.expression.callee && node.expression.callee.name === 'require' && node.expression.arguments && node.expression.arguments[0]) {
        dependencies.push(node.expression.arguments[0].value);
      }
    }
  })
  return dependencies;
}

// 提供标准的jsbabel方法
exports.standardBabel = function({source, options}) {
  // options 这里需要兼容
  options = options || exports.standardBabelOptions;
  let output = babel.transformSync(source, options); // => { code, map, ast }
  return output;
}

exports.standardBabelOptions = {
  "presets": [
    "flow",
    [
      "env",
      {
        "targets": {
          "browsers": [
            "> 1%",
            "last 2 versions",
            "not ie <= 8"
          ]
        }
      }
    ],
    "stage-0"
  ],
  "plugins": [
    "transform-remove-strict-mode",
    ["transform-runtime", {
      "helpers": false,
      "polyfill": false,
      "regenerator": true,
      "moduleName": "babel-runtime"
    }],
    ["babel-plugin-chameleon-import", {
      "libraryName": "chameleon-api",
      "libraryDirectory": "src/interfaces",
      "libraryFileName": "index.js",
      "defaulLibraryDirectory": "",
      "defaulLibraryFileName": "index.js"
    }]
  ]
}
