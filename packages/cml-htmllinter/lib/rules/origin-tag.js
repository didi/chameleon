var knife = require('../knife'),
    proc = require('../process_option');

module.exports = {
    name: 'origin-tag',
    on: ['dom'],
    filter: ['tag'],
    hooks: ['skip-normal-tag']
};

module.exports.lint = function(element, opts) {
    var matcher = knife.matchFilter.bind(knife, element.name);
    var s = this.subscribers.filter(matcher);
    return knife.applyRules(s, element, opts);
};
