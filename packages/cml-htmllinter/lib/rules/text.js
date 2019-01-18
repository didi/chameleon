var knife = require('../knife'),
    proc = require('../process_option');

module.exports = {
  name: 'text',
  on: ['dom'],
  filter: ['text']
};

module.exports.lint = function(element, opts) {
    var matcher = knife.matchFilter.bind(knife, element.data);
    var s = this.subscribers.filter(matcher);
    return knife.applyRules(s, element, opts);
};
