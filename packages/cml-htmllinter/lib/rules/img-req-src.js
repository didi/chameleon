var knife = require('../knife'),
    Issue = require('../issue');

module.exports = {
    name: 'img-req-src',
    on: ['tag'],
    filter: ['img'],
    desc: 'If set, a source must be given for each `img` tag.'
};

module.exports.lint = function (element, opts) {
    return knife.hasNonEmptyAttr(element, 'src')
        ? []
        : new Issue('E014', element.openLineCol);
};
