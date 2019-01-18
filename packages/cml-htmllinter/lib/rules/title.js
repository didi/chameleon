var Issue = require('../issue'),
    knife = require('../knife');

module.exports = {
    name: 'title',
    on: ['tag'],
    filter: ['head']
};

module.exports.lint = function (elt, opts) {
    var titles = elt.children.filter(function (e) {
        return e.type === 'tag' && e.name === 'title';
    });
    titles.head = elt;
    return knife.applyRules(this.subscribers, titles, opts);
};
