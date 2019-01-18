const bablePaser = require('@babel/parser');

/**
 * @return {Array} [{name: 'propName', pos: [line, columm]}]
 */
module.exports.getPropsFromObjectExpression = function(expressionStr) {
  let props = [];

  try {
    let expression = bablePaser.parseExpression(expressionStr);
    if (expression.type === 'ObjectExpression') {
      expression.properties && expression.properties.forEach((prop) => {
        if (prop.key.type === 'Identifier') {
          props.push({
            name: prop.key.name,
            pos: [prop.loc.start.line, prop.loc.start.column]
          });
        }
        if (prop.key.type === 'StringLiteral') {
          props.push({
            name: prop.key.value,
            pos: [prop.loc.start.line, prop.loc.start.column + prop.key.extra.raw.indexOf(prop.key.value)]
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }

  return props;
}
