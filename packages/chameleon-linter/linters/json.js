const jsonlint = require('json-lint');
const config = require('../config/parser-config');
const parse = require('@babel/parser').parse;

module.exports = async (part) => {
  let messages = [];
  let result = jsonlint(part.content, {
    comments: false
  });


  if (result.error) {
    messages.push({
      line: result.line,
      column: result.character,
      token: result.c,
      msg: result.error
    });
  }

  const opts = config.script;

  let obj = null;

  try {
    obj = (new Function('return ' + part.content.replace(/^\n*/g, '') + ';'))();
  }
  catch (e) {}

  return {
    start: part.line,
    ast: result.error ? null : parse('module.exports = \n' + part.content, opts),
    obj: obj,
    messages
  };
};
