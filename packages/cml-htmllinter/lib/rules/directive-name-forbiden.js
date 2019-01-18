var Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'directive-name-forbiden',
    on: ['attr'],
    options: [{
        name: 'directive-name-forbidden-regex',
        desc: [
'A format specifier, or `false`.',
'If set, attribute names match the given format is disallowed.'
].join('\n'),
        process: proc.regex
    }]
};

module.exports.lint = function (attr, opts) {
    let format = opts['directive-name-forbidden-regex'];
    if (format && format.test(attr.name)) {
        let directive =  format.exec(attr.name);
        return new Issue('E062', attr.nameLineCol, { attribute: directive[1], lang: opts['template-lang'] });
    }
    return [];
};
