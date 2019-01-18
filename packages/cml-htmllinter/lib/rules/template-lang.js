var Issue = require('../issue'),
    knife = require('../knife'),
    proc = require('../process_option');

module.exports = {
    name: 'template-lang',
    on: ['tag'],
    filter: ['template'],
    options: [{
        name: 'template-lang-allows',
        desc: [
'If set, the lang tag must have a valid form (`xx-YY`, where `xx` is a',
'valid language code and `YY` is a valid country code). If the value is',
'equal to "case", the tag must be capitalized conventionally (with the',
'language code lowercase and the country code uppercase).'
].join('\n'),
        process: proc.arrayOfStr
    }, {
        name: 'template-req-lang',
        desc: 'If set, each `html` tag must have a `lang` attribute.',
        process: proc.bool
    }]
};

module.exports.lint = function (element, opts) {
    var a = element.attribs;
    if (a && a.hasOwnProperty('lang')) {
        var l = a.lang.value || '';
        if (opts['template-lang-allows']) {
            if (opts['template-lang-allows'].indexOf(l) === -1) {
                return new Issue('E060', a.lang.valueLineCol, {lang:l});
            }
        }
        return [];
    }

    return opts['template-req-lang'] ?
        new Issue('E059', element.openLineCol) : [];
};