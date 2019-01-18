const Tools = require('../../tools');
const options = require('../../options');

module.exports = {
  name: 'vue'
}

module.exports.run = function(node, opts) {
  let subs = this.subscribers;
  let results = [];
  subs && subs.forEach((sub) => {
    if (Tools.isRuleMatch(node, sub)) {
      results = results.concat(sub.run(node, opts));
    }
  });

  results = results.filter((item) => {
    return options.getOption('vueSystemVarNames').indexOf(item.name) === -1;
  });

  return results;
}
