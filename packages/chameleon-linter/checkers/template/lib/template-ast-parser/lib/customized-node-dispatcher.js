const rules = require('../rules/component');
const options = require('../options');
const RuleLoader = require('../classes/rule-loader');

module.exports.getResults = function(nodes) {
  let allOptions = options.getAllOptions();
  let results = [];
  let loader = new RuleLoader(rules);

  nodes && nodes.forEach((node) => {
    if (~options.getOption('langs').indexOf(node.lang)) {
      let matchRule = loader.getRuleByName('attr');
      if (matchRule) {
        results = results.concat(matchRule.run(node, allOptions));
      }
    }
  });

  // attrResults && attrResults.forEach((compNode) => {
  //   Object.assign(results, compNode);
  // });

  return results;
}

