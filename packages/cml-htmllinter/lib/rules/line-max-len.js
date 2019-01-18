var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'line-max-len',
    on: ['line'],
    options: [{
        desc: [
'The value of this option is either `false` or a positive integer. If it',
'is a number, the length of each line must not exceed that number.'
].join('\n'),
        process: proc.posInt
    }, {
        name: 'line-max-len-ignore-regex',
        desc: [
'A string giving a regular expression, a RegExp object, or `false`. If',
'set, lines with names matching the given regular expression are ignored',
'for the `line-length` rule. For example, lines with long `href` attributes',
'can be excluded with regex `href`.'
].join('\n'),
        process: proc.regex,
        rules: []
    }]
};

module.exports.lint = function (line, opts) {
    var maxLength = opts[this.name],
        ignoreRegExp = opts[this.name + '-ignore-regex'];

    var lineText = line.line.replace(/(\r\n|\n|\r)$/, '');

    if (ignoreRegExp && ignoreRegExp.test(lineText)) {
        return [];
    }

    var len = lineText.length;

    return len > maxLength
        ? new Issue('E040', [line.row, len],
                    { maxlength: maxLength, length: len })
        : [];
};
