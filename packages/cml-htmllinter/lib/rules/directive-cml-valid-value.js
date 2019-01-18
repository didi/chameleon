var Issue = require('../issue'),
    knife = require('../knife'),
    proc = require('../process_option');

module.exports = {
  name: 'directive-cml-valid-value',
  on: ['directive-cml'],
  filter: ['c-if', 'c-else-if', 'c-for', 'c-model', 'c-text', 'c-show', 'c-animation'],
  options: [{
    name: 'cml-valid-value-regex',
    desc: 'If set, all diretives that can have values will be checked.',
    process: proc.regex
  }]
}

module.exports.lint = function(attr, opts) {
  if(opts['cml-valid-value-regex']) {
    return opts['cml-valid-value-regex'].test(attr.value) ? [] : new Issue('E072', attr.valueLineCol, {
      name: attr.name,
      lang: opts['template-lang']
    });
  }
  return [];
}