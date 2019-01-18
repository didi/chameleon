module.exports.isRuleMatch = function(node, rule) {
  return node && rule && rule.filter && rule.filter.run(node[rule.filter.key]);
}
