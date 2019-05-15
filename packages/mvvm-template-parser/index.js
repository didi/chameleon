const {vueToCml, preDisappearAnnotation} = require('./lib/process-template.js');
const parser = require('mvvm-babel-parser');
const generator = require('mvvm-babel-generator/lib')
const types = require('@babel/types');
const traverse = require('@babel/traverse');
exports.parser = parser;
exports.generator = function(...args) {
  let result =  generator["default"].apply(this, args);
  result.code = exports.postParseUnicode(result.code);
  if (/;$/.test(result.code)) { // 这里有个坑，jsx解析语法的时候，默认解析的是js语法，所以会在最后多了一个 ; 字符串；但是在 html中 ; 是无法解析的；
    result.code = result.code.slice(0, -1);
  }
  return result;
};
exports.types = types;
exports.traverse = traverse["default"];
exports.vueToCml = vueToCml;

exports.cmlparse = function(content) {
  content = preDisappearAnnotation(content);
  return parser.parse(content, {
    plugins: ['jsx']
  })
}

// 后置处理：用于处理 \u ，便于解析unicode 中文
exports.postParseUnicode = function(content) {
  let reg = /\\u/g;
  return unescape(content.replace(reg, '%u'));
}
