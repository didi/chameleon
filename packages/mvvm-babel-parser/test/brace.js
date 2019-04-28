const parser = require('../lib/index.js');
var path = require('path');
var fs = require('fs');
const t = require('babel-types');
const expect = require('chai').expect;
var code = fs.readFileSync(path.join(__dirname, './testjsx.tpl'), {encoding: 'utf8'});
const traverse = require('babel-traverse');
const generate = require('babel-generator');

describe('brace', function() {
  it('brace', function() {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    traverse.default(ast, {
      enter: (path)=>{
        if (t.isJSXExpressionContainer(path.node)) {
          expect(path.node.expression.left.name).to.equal('ss');
          expect(path.node.expression.operator).to.equal('+');
          expect(path.node.expression.right.value).to.equal('123');
          expect(path.node.expression.left.name).to.equal('ss');
          expect(t.isIdentifier(path.node.expression.left)).to.equal(true);
          expect(t.isLiteral(path.node.expression.right)).to.equal(true);
        }
      }
    })

    expect(true).to.equal(true);
  })
})
