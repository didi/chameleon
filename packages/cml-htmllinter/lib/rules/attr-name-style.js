var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'attr-name-style',
    on: ['attr'],
    options: [{
        desc: [
'A format specifier, or `false`. If set, attribute names must conform to',
'the given format.'
].join('\n'),
        process: proc.format
    }, {
        name: 'attr-name-ignore-regex',
        desc: [
'A string giving a regular expression, a RegExp object, or `false`. If',
'set, `attr`s with names matching the given regular expression are ignored',
'for the `attr-name-style` rule. For example, excluding `{{...}}` names',
'used by Angular and other templating methods can be done with the regex',
'`{{.*?}}`.'
].join('\n'),
        process: proc.regex,
        rules: []
    }]
};

module.exports.lint = function (attr, opts) {
    var format = opts[this.name];

    var ignore = opts['attr-name-ignore-regex'];
    if (ignore && ignore.test(attr.name)) { return []; }

    return format.test(attr.name) ? [] :
        new Issue('E002', attr.nameLineCol, { format: format.name });
};
