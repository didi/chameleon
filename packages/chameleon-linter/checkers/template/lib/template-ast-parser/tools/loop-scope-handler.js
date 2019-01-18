const bablePaser = require('@babel/parser');

const forLoopDirectives = {
  vue: {
    for: 'v-for'
  },
  cml: {
    for: 'c-for',
    item: 'c-for-item',
    index: 'c-for-index'
  },
  wx: {
    for: 'wx:for',
    item: 'wx:for-item',
    index: 'wx:for-index'
  }
};

module.exports.hasForLoopDirective = function({tag = {}, lang = 'cml'}) {
  return tag.attribs ? ~Object.keys(tag.attribs).indexOf(forLoopDirectives[lang]['for']) : false;
}

/**
 * @return {Array} scope [itemName, indexName]
 */
module.exports.getScopeFromTag = function({tag = {}, lang = 'cml'}) {
  let scope = [];

  if (lang === 'vue') {
    let expressionNode = {};

    try {
      expressionNode = bablePaser.parseExpression(tag.attribs[forLoopDirectives[lang]['for']].value);
    } catch (err) {
      console.trace(err);
    }

    // if (expressionNode.type === 'Identifier') {
    //   scope.push(...['item', 'index']);
    // }
    if (expressionNode.type === 'BinaryExpression') {
      if (expressionNode.left.type === 'SequenceExpression') {
        expressionNode.left.expressions.forEach((identifierNode) => {
          if (identifierNode.type === 'Identifier') {
            scope.push(identifierNode.name);
          }
        });
      }
      if (expressionNode.left.type === 'Identifier') {
        scope.push(expressionNode.left.name);
      }
    }
  } else if (lang === 'cml' || lang === 'wx') {
    if (tag.attribs[forLoopDirectives[lang].item]) {
      scope.push(tag.attribs[forLoopDirectives[lang].item].value);
    } else {
      scope.push('item');
    }
    if (tag.attribs[forLoopDirectives[lang].index]) {
      scope.push(tag.attribs[forLoopDirectives[lang].index].value);
    } else {
      scope.push('index');
    }
  }

  return scope;
}
