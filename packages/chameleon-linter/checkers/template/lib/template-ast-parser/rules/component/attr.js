const Tools = require('../../tools');

module.exports = {
  name: 'attr'
}

module.exports.run = function(node, opts) {
  let subs = this.subscribers;
  let result = {};
  let attrResults = [];

  subs && subs.forEach((sub) => {
    if (Tools.isRuleMatch(node, sub)) {
      node.attrs.forEach((attr) => {
        attrResults = attrResults.concat(sub.run(attr, opts));
      });
    }
  });

  result[node.name] = {props: [], events: []};
  attrResults.forEach((attNode) => {
    if (attNode.prop) {
      result[node.name].props.push(attNode);
    } else {
      result[node.name].events.push(attNode);
    }
  });

  return [result];
}
