// import * as t from "@babel/types";
const t = require('@babel/types');
const { SyncHook } = require("tapable");
const utils = require('../common/utils');

let parseTextContent = new SyncHook(['args'])
parseTextContent.tap('wx', (args) => {
  let { node, type } = args;
  if (type === 'wx' || type === 'web' || type === 'weex') {

    let jsxElementChildren = node.children;
    let tagName = node.openingElement.name.name;
    if (tagName !== 'text' && tagName !== 'span') { // 当tagName不是text的时候，开始处理该jexELemnt的子元素
      let attributes = JSON.parse(JSON.stringify(node.openingElement.attributes));
      let inheritAttributes = attributes.filter((attr) => attr.name.name === 'class' || attr.name.name.name === 'class' ||
          attr.name.name === 'style' || attr.name.name.name === 'style');

      let openTag = t.jsxOpeningElement(t.jsxIdentifier('text'), inheritAttributes);
      let closeTag = t.jsxClosingElement(t.jsxIdentifier('text'));

      let jsxTextNodes = jsxElementChildren.filter((child) => t.isJSXText(child));
      jsxTextNodes.forEach((textNode) => {
        let isOnlySpace = utils.isOnlySpaceContent(textNode.value);
        if (!isOnlySpace) {
          let insertNode = t.jsxElement(openTag, closeTag, [textNode], false);
          let delIndex = jsxElementChildren.indexOf(textNode);
          if (delIndex !== -1) {
            jsxElementChildren[delIndex] = insertNode;
          }
        }
      })
    }
  }

})


module.exports.parseTextContent = parseTextContent;
