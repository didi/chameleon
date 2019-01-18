var Issue = require('../issue'),
    knife = require('../knife'),
    proc = require('../process_option');

module.exports = {
    name: 'lang',
    on: ['tag'],
    filter: ['html'],
    options: [{
        name: 'lang-style',
        desc: [
'If set, the lang tag must have a valid form (`xx-YY`, where `xx` is a',
'valid language code and `YY` is a valid country code). If the value is',
'equal to "case", the tag must be capitalized conventionally (with the',
'language code lowercase and the country code uppercase).'
].join('\n'),
        process: proc.boolPlus('case')
    }, {
        name: 'html-req-lang',
        desc: 'If set, each `html` tag must have a `lang` attribute.',
        process: proc.bool
    }]
};

module.exports.lint = function (element, opts) {
    var a = element.attribs;
    if (a && a.hasOwnProperty('lang')) {
        var l = a.lang.value;
        if (opts['lang-style']) {
            var valid = knife.checkLangTag(l);
            if (valid === 1) {
                return new Issue('E038', a.lang.valueLineCol, {lang:l});
            }
            if (opts['lang-style'] === 'case' && valid === 2) {
                return new Issue('E039', a.lang.valueLineCol, {lang:l});
            }
        }
        return [];
    }

    return opts['html-req-lang'] ?
        new Issue('E025', element.openLineCol) : [];
};
