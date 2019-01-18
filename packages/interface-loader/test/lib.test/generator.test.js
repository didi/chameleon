/**
 * 对check方法进行包装  处理flow的语法
 */
const check = require('../../src/lib/check.js');
/* eslint-disable no-unused-vars */
const generate = require("babel-generator");
const flow = require('babel-preset-flow');
/* eslint-disable no-unused-vars */
var babel = require("babel-core");
const path = require('path');

function generator(code, cb) {
  let result;
  result = check.getCode(code, {
    cmlType: 'web',
    filePath: '/Users/didi/Documents/cml/chameleon-cli',
    enableTypes: ['Nullable', 'Object', 'Array']
  });

  result = babel.transform(result, {
    presets: [
      'flow'
    ],
    babelrc: false,
    filename: path.join(__dirname)
  })
  return result.code;
}

module.exports = generator
