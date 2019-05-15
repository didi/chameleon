const {standardParser, generator, types, traverse} = require('../index.js');

const template = `
<view c-bind:tap="click1">
  <text>{{'名称'+name}}</text>
</view>
`

const {ast} = standardParser({
  source: template,
  lang: 'cml'
})
traverse(ast, {
  enter: (path) => {
    let node = path.node;
    if (types.isJSXOpeningElement(node)) {
      if (types.isJSXIdentifier(node.name) && node.name.name === 'view') {
        node.name.name = 'div';
      }
    }
    if (types.isJSXClosingElement(node)) {
      if (types.isJSXIdentifier(node.name) && node.name.name === 'view') {
        node.name.name = 'div';
      }
    }
  }
})

const output = generator(ast);

console.log(output)
