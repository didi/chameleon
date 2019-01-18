var knife = require('../knife'),
    proc = require('../process_option');

module.exports = {
    name: 'tag',
    on: ['dom'],
    filter: ['tag'],
    hooks: ['skip-origin-tag']
};

module.exports.lint = function(element, opts) {
    var matcher = knife.matchFilter.bind(knife, element.name);
    var s = this.subscribers.filter(matcher);
    return knife.applyRules(s, element, opts);
};
