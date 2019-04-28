const {cmlparse, generator, types: t, traverse} = require('mvvm-template-parser');


module.exports = function(content) {
  let ast = cmlparse(content);
  traverse(ast, {
    enter(path) {
      let node = path.node;
      if (t.isJSXElement(node)) {
        let attributes = node.openingElement.attributes;
        attributes.forEach(attr=>{
          if(t.isJSXIdentifier(attr.name) && attr.name.name === 'c-for') {
            attr.name.name = 'wx:for'
          }
          if(t.isJSXIdentifier(attr.name) && attr.name.name === 'c-if') {
            attr.name.name = 'wx:if'
          }
        })
        let tagName = node.openingElement.name.name;
        if(/^origin\-/.test(tagName)) {
          let newtagName = tagName.replace(/^origin\-/,'');
          node.openingElement.name.name = newtagName;
          node.closingElement.name.name = newtagName;
        }
      }
    }
  });
  return generator(ast).code;
}