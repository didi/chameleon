var knife = require('../knife'),
    Issue = require('../issue');

module.exports = {
    name: 'id-class-no-ad',
    on: ['attr'],
    filter: ['id', 'class'],
    desc: [
'If set, values for the `id` and `class` attributes may not use the word',
'"ad", "banner", or "social".',
'This rule only bans those words when not adjacent to other alphanumeric',
'characters. Thus words like "gradient" are still allowed.'
].join('\n')
};

module.exports.lint = function (attr, opts) {
    var regex = /(^|[^a-zA-Z0-9])(ad|banner|social)(?![a-zA-Z0-9])/;
    var match = regex.exec(attr.value);
    if (!match) { return []; }
    var ind = match.index + match[1].length,
        lc = knife.getLineColFunc(attr.value, attr.valueLineCol)(ind);
    return new Issue('E010', lc, { word: match[2] });
};
