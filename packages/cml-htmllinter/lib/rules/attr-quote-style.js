var Issue = require('../issue');

module.exports = {
    name: 'attr-quote-style',
    on: ['attr'],
    desc: [
'* "double": Attribute values must be quoted using double quotes.',
'* "single": Attribute values must be quoted using single quotes.',
'* "quoted": Attribute values must be quoted.',
'* `false`: No restriction.',
'',
'Applies only to attributes with values (including the empty quoted values',
'`\'\'` and `""`). To catch attributes with no values, use `attr-req-value`.'
].join('\n'),
    process: function (o) {
        var formats = {
            'double': { regex: /^"/, desc: 'double quoted' },
            'single': { regex: /^'/, desc: 'single quoted' },
            'quoted': { regex: /^['"]/, desc: 'quoted' }
        };
        return formats.hasOwnProperty(o) ? formats[o] : undefined;
    }
};

module.exports.lint = function (attr, opts) {
    var format = opts[this.name],
        issues = [];

    var v = attr.rawValue;
    if (v && !format.regex.test(v)) {
        var msgData = {
            attribute: attr.name,
            format: format.desc
        };
        return new Issue('E005', attr.valueLineCol, msgData);
    }

    return [];
};
