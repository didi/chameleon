const stylelint = require('stylelint');
const config = require('../config');
const parserConfig = require('../config/parser-config');
const postcss = require('postcss');

module.exports = async (part) => {
  return new Promise(function (resolve, reject) {
    let messages = [];
    if (config.neexLintWeex() && (!part.platformType || part.platformType == 'weex')) {
      parserConfig.style.rules['selector-max-compound-selectors'] = 1;
    }
    else {
      parserConfig.style.rules['selector-max-compound-selectors'] = 0;
    }

    stylelint
      .lint({
        code: part.content,
        config: parserConfig.style,
        syntax: part.params.lang || 'less'
      })
      .then(function(result) {
        if (result.errored) {
          result.results.forEach(result => {
            result.errored && result.warnings.forEach(warn => {
              messages.push({
                line: warn.line,
                column: warn.column,
                msg: warn.text.replace(/\(.*?\)$/g, '')
              });
            });
          });
        }

        let ast;
        try {
          ast = postcss.parse(part.content);
        }
        catch (e) {
          ast = null;
        }

        resolve({
          start: part.line,
          ast: ast,
          messages
        });
      });
  })
};
