var knife = require('../knife'),
    Issue = require('../issue'),
    proc = require('../process_option');

module.exports = {
    name: 'img-req-alt',
    on: ['tag'],
    filter: ['img'],
    desc: [
'* `true`: Each `img` tag must have a non-empty `alt` property.',
'* "allownull": Each `img` tag must have an `alt` property with a value,',
'    but value may be null (equal to `""`).',
'* `false`: No restriction.'
].join('\n'),
    process: proc.boolPlus('allownull')
};

module.exports.lint = function (element, opts) {
    var opt = opts[this.name];
    if (knife.hasNonEmptyAttr(element, 'alt', opt === 'allownull')) {
        return [];
    }

    return new Issue('E013', element.openLineCol);
};
