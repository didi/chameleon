const parser = require('@babel/parser');
const traverse = require('@babel/traverse')['default'];

const objectBlockStatement = /^\s*{(.*)}\s*$/;
const fakePrefix = 'cml=';

/**
 * @param {Object} loc
 * @param {Boolean} isFakeBlock
 */
function getStartPos(loc, isFakeBlock = false) {
  let pos = [0, 0];
  // loc.start.column begins with 0
  if (loc && loc.start) {
    if (isFakeBlock) {
      pos = [loc.start.line, loc.start.column - fakePrefix.length];
    } else {
      pos = [loc.start.line, loc.start.column];
    }
  }
  return pos;
}

function getVarFromIdentifier(node, isFakeBlock, method = false) {
  return {
    name: node.name,
    method: method,
    variable: !method,
    pos: getStartPos(node.loc, isFakeBlock)
  };
}


module.exports.parseSingleExpression = function(expressinoStr = '') {
  let nodes = [];
  let ast = null;
  let isFakeBlock = false;

  /**
   * !!We are using babel parser to get an ast of current expression, which takes experssion as
   * an entire program. So when we pass something like {a:1,b:3} this will be considered as
   * a blockstatement and obviously it contains a syntax error.
   * So we wrap the expression we assingment expression in those particular cases.
   */
  if (objectBlockStatement.test(expressinoStr)) {
    expressinoStr = fakePrefix + expressinoStr;
    isFakeBlock = true;
  }

  try {
    ast = parser.parse(expressinoStr);
  } catch (err) {
    console.trace(err);
  }

  ast && traverse(ast, {
    Identifier(path) {
      if (path.parent.type === 'ExpressionStatement') {
        nodes.push(getVarFromIdentifier(path.node, isFakeBlock));
      }
    },
    MemberExpression(path) {
      if (path.get('object').isIdentifier()) {
        nodes.push(getVarFromIdentifier(path.node.object, isFakeBlock));
      }
      if (path.get('property').isIdentifier() && path.node.computed) {
        nodes.push(getVarFromIdentifier(path.node.property, isFakeBlock));
      }
    },
    LogicalExpression(path) {
      if (path.get('left').isIdentifier()) {
        nodes.push(getVarFromIdentifier(path.node.left, isFakeBlock));
      }
      if (path.get('right').isIdentifier()) {
        nodes.push(getVarFromIdentifier(path.node.right, isFakeBlock));
      }
    },
    BinaryExpression(path) {
      if (path.get('left').isIdentifier()) {
        nodes.push(getVarFromIdentifier(path.node.left, isFakeBlock));
      }
      if (path.get('right').isIdentifier()) {
        nodes.push(getVarFromIdentifier(path.node.right, isFakeBlock));
      }
    },
    LogicalExpression(path) {
      if (path.get('left').isIdentifier()) {
        nodes.push(getVarFromIdentifier(path.node.left, isFakeBlock));
      }
      if (path.get('right').isIdentifier()) {
        nodes.push(getVarFromIdentifier(path.node.right, isFakeBlock));
      }
    },
    SequenceExpression(path) {
      path.get('expressions').forEach((ele) => {
        if (ele.isIdentifier()) {
          nodes.push(getVarFromIdentifier(ele.node, isFakeBlock));
        }
      });
    },
    ConditionalExpression(path) {
      ['test', 'alternate', 'consequent'].forEach((key) => {
        if (path.get(key).isIdentifier()) {
          nodes.push(getVarFromIdentifier(path.node[key], isFakeBlock));
        }
      });
    },
    CallExpression(path) {
      if (path.get('callee').isIdentifier()) {
        nodes.push(getVarFromIdentifier(path.node.callee, isFakeBlock, true));
      }
      path.get('arguments').forEach((arg) => {
        if (arg.isIdentifier()) {
          nodes.push(getVarFromIdentifier(arg.node, isFakeBlock));
        }
      });
    },
    ArrayExpression(path) {
      path.get('elements').forEach((ele) => {
        if (ele.isIdentifier()) {
          nodes.push(getVarFromIdentifier(ele.node, isFakeBlock));
        }
      });
    },
    ObjectExpression(path) {
      path.get('properties').forEach((ele) => {
        if (ele.isIdentifier()) {
          nodes.push(getVarFromIdentifier(ele.node, isFakeBlock));
        }
      });
    }
  });

  return nodes;
}
