const _ = module.exports = {};
const fs = require('fs');
const path = require('path');
const babylon = require('@babel/parser');
const traverse = require('babel-traverse')["default"];
const t = require('@babel/types')
const cmlUtils = require('chameleon-tool-utils');

/** *
 * @param:loaderContext  webpack loader的上下文
 * @param:filePath 文件的绝对路径，用来读取文件内容
 * @param:context 项目的根目录 /Users/didi/work/cml-test/miniapp-script
 * 用来得到 var entryPath = cmlUtils.getEntryPath(self.resourcePath, context);
 * self.emitFile(entryPath, content);
 * @param:type  wx alipay baidu
*/
_.addMiniAppScript = function(loaderContext, filePath, context, type) {
  let miniAppPaths = _.parseMiniAppScript(filePath, type);
  if (miniAppPaths.length) {
    miniAppPaths.forEach((item) => {
      // 得到需要emit出的文件相对于被处理的文件（.wxml  .wxs）的绝对路径
      let innerFilePath = path.resolve(path.dirname(filePath), item);
      // 得到要导出的文件相对于 output.path的相对路径
      let entryPath = cmlUtils.getEntryPath(innerFilePath, context);
      let fileContent = fs.readFileSync(innerFilePath, {encoding: 'utf-8'});
      loaderContext.emitFile(entryPath, fileContent);
      // 递归处理文件
      _.addMiniAppScript(loaderContext, innerFilePath, context, type)
    })
  }

}

/**
 * @param:filePath 文件的路径，可能是 .wxml或者 .wxs 的内容
 * @param:type wx alipay baidu
 *
 * @return:解析 .wxml  .wxs文件之后返回的一个相对路径数组 :['../wxs/utils.wxs','../wxs/utils1.wxs']
 *
*/
_.parseMiniAppScript = function(filePath, type) {
  let miniAppPaths
  if (type === 'wx') {
    miniAppPaths = _.parseMiniAppScriptForWx(filePath);
  }
  if (type === 'alipay') {
    miniAppPaths = _.parseMiniAppScriptForAlipay(filePath);
  }
  if (type === 'baidu') {
    miniAppPaths = _.parseMiniAppScriptForBaidu(filePath);
  }
  return miniAppPaths || [];

}
_.parseMiniAppScriptForWx = function (filePath) {
  let source = fs.readFileSync(filePath, {encoding: 'utf-8'});
  let extName = path.extname(filePath);
  let scriptPaths = [];
  if (extName === '.wxml') {
    // <wxs src="../wxs/utils.wxs" module="utils" />
    // <wxs module="sss" src="../wxs/utils.wxs" module="utils" ></wxs>
    let miniScriptTagReg = /<wxs[\s\S]*?[\/]*>/g;
    let srcReg = /src\s*=\s*("[^"]*"|'[^']*')/
    let matches = source.match(miniScriptTagReg);
    if (!matches) {
      return []
    } else if (matches && Array.isArray(matches)) {
      matches.forEach((item) => {
        let srcMatches = item.match(srcReg);
        if (srcMatches && Array.isArray(srcMatches)) {
          scriptPaths.push(srcMatches[1].slice(1, -1))
        }
      })
    }
  } else if (extName === '.wxs') {
    let callback = function(path) {
      let node = path.node;
      if (t.isCallExpression(node) && node.callee.name === 'require' && node.arguments[0]) {
        let value = node.arguments[0].value
        if (typeof value === 'string' && value.endsWith('.wxs')) {
          scriptPaths.push(node.arguments[0].value)
        }

      }
    };
    _.commonParseScript(source, callback);
  }
  return scriptPaths;
}
_.parseMiniAppScriptForAlipay = function (filePath) {
  let source = fs.readFileSync(filePath, {encoding: 'utf-8'});
  let extName = path.extname(filePath);
  let scriptPaths = [];
  if (extName === '.axml') {
    let miniScriptTagReg = /<import-sjs[\s\S]*?[\/]*>/g;
    let srcReg = /from\s*=\s*("[^"]*"|'[^']*')/
    let matches = source.match(miniScriptTagReg);
    if (!matches) {
      return []
    } else if (matches && Array.isArray(matches)) {
      matches.forEach((item) => {
        let srcMatches = item.match(srcReg);
        if (srcMatches && Array.isArray(srcMatches)) {
          scriptPaths.push(srcMatches[1].slice(1, -1))
        }
      })
    }
  } else if (extName === '.sjs') {
    let callback = function(path) {
      let node = path.node;
      if (t.isCallExpression(node) && node.callee.name === 'require' && node.arguments[0]) {
        let value = node.arguments[0].value
        if (typeof value === 'string' && value.endsWith('.sjs')) {
          scriptPaths.push(node.arguments[0].value)
        }

      }
    };
    _.commonParseScript(source, callback);
  }
  return scriptPaths;
}
_.parseMiniAppScriptForBaidu = function (filePath) {
  let source = fs.readFileSync(filePath, {encoding: 'utf-8'});
  let extName = path.extname(filePath);
  if (filePath.endsWith('.filter.js')) {
    extName = '.filter.js';
  }
  let scriptPaths = [];
  if (extName === '.swan') {
    let miniScriptTagReg = /<filter[\s\S]*?[\/]*>/g;
    let srcReg = /from\s*=\s*("[^"]*"|'[^']*')/
    let matches = source.match(miniScriptTagReg);
    if (!matches) {
      return []
    } else if (matches && Array.isArray(matches)) {
      matches.forEach((item) => {
        let srcMatches = item.match(srcReg);
        if (srcMatches && Array.isArray(srcMatches)) {
          scriptPaths.push(srcMatches[1].slice(1, -1))
        }
      })
    }
  } else if (extName === '.filter.js') {
    let callback = function(path) {
      let node = path.node;
      if (t.isCallExpression(node) && node.callee.name === 'require' && node.arguments[0]) {
        let value = node.arguments[0].value
        if (typeof value === 'string' && value.endsWith('.filter.js')) {
          scriptPaths.push(node.arguments[0].value)
        }

      }
    };
    _.commonParseScript(source, callback);
  }
  return scriptPaths;
}

_.commonParseScript = function(source, callback) {
  let ast = babylon.parse(source);
  traverse(ast, {
    enter(path) {
      callback(path)
    }
  })
}
