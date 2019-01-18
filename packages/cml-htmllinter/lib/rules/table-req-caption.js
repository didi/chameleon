var Issue = require('../issue');

module.exports = {
    name: 'table-req-caption',
    on: ['tag'],
    filter: ['table'],
    desc: 'If set, each `table` must contain at least one `caption` tag.'
};

module.exports.lint = function (ele, opts) {
    return ele.children.some(function (c) { return c.name === 'caption'; })
        ? []
        : new Issue('E031', ele.openLineCol);
};
