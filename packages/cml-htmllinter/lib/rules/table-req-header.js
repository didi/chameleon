var Issue = require('../issue');

module.exports = {
    name: 'table-req-header',
    on: ['tag'],
    filter: ['table'],
    desc: [
'If set, each `table` tag must contain a header: a `thead` tag',
'or a `tr` tag with a `th` child.'
].join('\n')
};

module.exports.lint = function (ele, opts) {
    var children = ele.children,
        childIndex = 0,
        child;

    //ffwd to first relevant table child
    while ((child = children[childIndex]) &&
        (
            child.type !== 'tag' || // skip text nodes
            (child.name && child.name.match(/(caption|colgroup)/i))
        )
    ) {
        childIndex++;
    }

    if (child && child.name && child.name.match(/thead/i)) {
        return [];
    }

    if (child && child.name && child.name.match(/tr/i)) {
        // Check if any child in first row is `<th>`, not just first child (which could be a text node)
        for (var i = 0, l = child.children.length; i < l; i++) {
            if (child.children[i].name && child.children[i].name == 'th') {
                return []
            }
        }
    }

    return new Issue('E035', ele.openLineCol);
};
