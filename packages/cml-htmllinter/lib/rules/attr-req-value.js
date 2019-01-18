var knife = require('../knife'),
    Issue = require('../issue');

module.exports = {
    name: 'attr-req-value',
    on: ['attr'],
    desc: [
'If set, attribute values cannot be empty.',
'This does not disallow the value `""`.',
'',
'Boolean attributes such as `hidden` and `checked` do not require values,',
'but no attribute may have an equals sign but no value after it, like',
'`<div class=></div>`, as this is invalid html.'
].join('\n')
};

module.exports.lint = function (attr, opts) {
    var v = attr.rawEqValue;
    if (v ? /^[^'"]+=/.test(v) : !knife.isBooleanAttr(attr.name)) {
        return new Issue('E006', attr.valueLineCol, {name: attr.name});
    }

    return [];
};
