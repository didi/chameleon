var Issue = require('../issue');

module.exports = {
    name: 'head-req-title',
    on: ['title'],
    desc: 'If set, any `head` tag in the page must contain a non-empty `title` tag.'
};

module.exports.lint = function (titles, opts) {
    return titles.some(function(t) { return t.children.length > 0; })
        ? []
        : new Issue('E027', titles.head.openLineCol);
}
