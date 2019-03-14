const stylelint = require('stylelint');
const stylus = require('stylus/lib/stylus')
const config = require('../config');
const parserConfig = require('../config/parser-config');
const postcss = require('postcss');
const converter = require('stylus-converter');

module.exports = async (part) => {
  return new Promise(function (resolve, reject) {
    let messages = [];
    if (config.neexLintWeex() && (!part.platformType || part.platformType == 'weex')) {
      parserConfig.style.rules['selector-max-compound-selectors'] = 1;
    }
    else {
      parserConfig.style.rules['selector-max-compound-selectors'] = 0;
    }
    let lang = part.params.lang || 'less';
    if (lang == 'stylus') {
      stylus.render(part.content, parserConfig.style, function (err) {
        if (err) {
          let msgs = err.message.split('\n').filter(msg => {
            if (/^\s*$/.test(msg)) {
              return false;
            }
            else if (/^\-*\^/.test(msg)) {
              return false;
            }
            return true;
          });
          let message = {
            line: 0,
            column: 0,
            msg: ''
          };
          msgs.shift().replace(/stylus:\s*(\d+):\s*(\d+)/g, (match, line, column) => {
            message.line = +line;
            message.column = +column;
          });
          let flag = false;
          msgs.forEach(msg => {
            if (/^\s*\d+\|/.test(msg)) {
              flag = true;
              return ;
            }
            if (flag == true) {
              message.msg = msg;
              flag = false;
            }
          });
          messages.push(message);
        }
        let ast;
        try {
          let sassCode = converter.converter(part.content, {conver: 'sass', autoprefixer: false});
          sassCode = sassCode.replace(/\n\s*\}/g, '}');
          ast = postcss.parse(sassCode);
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
    }
    else {
      let options = {
        code: part.content,
        config: parserConfig.style
      };
      if (~['less', 'sass', 'scss'].indexOf(lang)) {
        options.syntax = lang;
      }
      stylelint
        .lint(options)
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
    }
  })

};
