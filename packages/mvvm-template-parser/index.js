const {vueToCml} = require('./lib/process-template.js');
const parser = require('mvvm-babel-parser');
const generator = require('mvvm-babel-generator/lib')
const types = require('@babel/types');
const traverse = require('@babel/traverse');

exports.parser = parser;
exports.generator = generator["default"];
exports.types = types;
exports.traverse = traverse["default"];
exports.vueToCml = vueToCml;

exports.cmlparse = function(content) {
  return parser.parse(content, {
    plugins: ['jsx']
  })
}
