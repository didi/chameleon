class RuleLoader {
  constructor(rules) {
    this.rulesMap = {};
    if (rules) {
      this.addSubscribers(rules);
    }
  }

  addSubscribers(rules) {
    rules.forEach(function(rule) {
      rule.subscribers = [];
      rules.forEach((onRule) => {
        if (onRule.on && ~onRule.on.indexOf(rule.name)) {
          rule.subscribers.push(onRule);
        }
      });
      this.rulesMap[rule.name] = rule;
    }.bind(this));
  }

  getRuleByName(ruleName) {
    return this.rulesMap[ruleName];
  }
}

module.exports = RuleLoader;
