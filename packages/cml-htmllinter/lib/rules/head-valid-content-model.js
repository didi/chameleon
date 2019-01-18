var Issue = require('../issue');

module.exports = {
    name: 'head-valid-content-model',
    on: ['tag'],
    filter: ['head'],
    desc: [
'If set, the content-model of the HEAD element will be enforced:',
'only `base`, `link`, `meta`, `noscript`, `script`, `style`, `template`,',
'and `title` tags are legal children.'
].join('\n')
};

module.exports.lint = function (elt, opts) {
    var legal_children = ['base', 'link', 'meta', 'noscript', 'script', 'style', 'template', 'title'];

    return elt.children.filter(function (e) {
        return e.type === 'tag' && legal_children.indexOf(e.name) < 0;
    }).map(function(e) {
        return new Issue('E047', e.openLineCol);
    });
};
