const Tools = require('../../tools');
const normalMethodRegex = /\(.*\)/;

module.exports = {
  name: 'mehtod-node',
  on: ['cml', 'vue'],
  filter: {
    key: 'name',
    run: function(value) {
      return /^c-bind|^v-on|^v-once|^@/.test(value);
    }
  }
}

/** *
 * @return {Array} An array contains info about variables and methods.
 * {name: 'varibale', method: false, variable: true, pos: [line, column]}
 */
module.exports.run = function(node, opts) {
  let results = [];
  let varsandMethods = [];
  let loopScopes = Tools.flatArray(node.loopScopes);

  // if current method only contains a method name without any parentheses, then we make one with argument literal string "true",
  // which won't be recognized as a variable and can avoid a systax error when the method name is match with some keywords of Javascript.
  if (!normalMethodRegex.test(node.rawValue)) {
    node.rawValue += '("true")';
  }

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
