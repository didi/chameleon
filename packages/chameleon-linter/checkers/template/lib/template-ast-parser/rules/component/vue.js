const Tools = require('../../tools');

module.exports = {
  name: 'vue',
  on: ['attr'],
  filter: {
    key: 'lang',
    run: function(value) {
      return value === 'vue'
    }
  }
}

module.exports.run = function(attr, opts) {
  let subs = this.subscribers;
  let attrResults = [];

  subs && subs.forEach((sub) => {
    if (Tools.isRuleMatch(attr, sub)) {
      attrResults = attrResults.concat(sub.run(attr, opts));
    }
  });

  return attrResults;
}
