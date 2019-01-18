const Tools = require('../../tools');

module.exports = {
  name: 'vue-directive-node',
  on: ['vue'],
  filter: {
    key: 'name',
    run: function(value) {
      return ~['v-else-if', 'v-for', 'v-html', 'v-if', 'v-model', 'v-show', 'v-text'].indexOf(value) || /^:|^v-bind/.test(value);
    }
  }
}

module.exports.run = function(node, opts) {
  let results = [];
  let varsandMethods = [];
  let loopScopes = Tools.flatArray(node.loopScopes);

  varsandMethods = Tools.parseSingleExpression(node.rawValue);

  results = varsandMethods.map((item) => {
    item.pos = [item.pos[0] + node.valuePos[0] - 1, item.pos[1] + node.valuePos[1]];
    return item;
  });

  if (loopScopes.length) {
    results = results.filter(resNode => !~loopScopes.indexOf(resNode.name));
  }

  return results;
}
