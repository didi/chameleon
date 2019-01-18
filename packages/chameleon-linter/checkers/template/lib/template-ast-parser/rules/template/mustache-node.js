const Tools = require('../../tools');

const mustacheRegex = /{{(.*?)}}/g;

module.exports = {
  name: 'method-node',
  on: ['cml', 'vue'],
  filter: {
    key: 'rawValue',
    run: function(value) {
      return mustacheRegex.test(value);
    }
  }
}

/** *
 * @return {Array} An array contains info about variables and methods.
 * {name: 'varibale', method: false, variable: true, pos: [line, column]}
 */
module.exports.run = function(node, opts) {
  let results = [];
  let expressionResults = [];
  let loopScopes = Tools.flatArray(node.loopScopes);

  node.rawValue && node.rawValue.replace(mustacheRegex, (match, expressionStr, offset) => {
    expressionResults = expressionResults.concat(Tools.parseSingleExpression(expressionStr));
    expressionResults.map((resNode) => {
      resNode.pos[1] = resNode.pos[1] + offset + match.indexOf(expressionStr);
      return resNode;
    });
  });
  // reset positons of variables and methods based on rawValue.
  results = expressionResults.map((resNode) => {
    resNode.pos = Tools.getVarOffsetPosFromText(node.rawValue, resNode.name, resNode.pos[1]);
    resNode.pos = [resNode.pos[0] + node.valuePos[0], resNode.pos[0] > 0 ? (resNode.pos[1] + 1) : (resNode.pos[1] + node.valuePos[1])];
    return resNode;
  });

  if (loopScopes.length) {
    results = results.filter(resNode => !~loopScopes.indexOf(resNode.name));
  }

  return results;
}
