const standardParser = require('./lib/standardParser');
const generator = require('@babel/generator');
const types = require('@babel/types');
const traverse = require('@babel/traverse');
exports.standardParser = standardParser;
exports.generator = generator["default"];
exports.types = types;
exports.traverse = traverse["default"];
