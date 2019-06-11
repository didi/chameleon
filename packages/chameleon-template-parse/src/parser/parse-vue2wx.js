const t = require('@babel/types')

const { SyncHook } = require("tapable");
const {
  interationMap, conditionMapVue2Wx
} = require('../common/cml-map.js');
const utils = require('../common/utils');

let parseVue2Wx = new SyncHook(['args'])
// 注意点，如果 parseVue2Wx 前面处理某个path将其path.remove()删除了，那么这个path走到了这里就会报错

parseVue2Wx.tap('vue2wx-condition,vue2alipay-condition', (args) => {
  let { node, type, options: {lang}} = args;
  if (lang === 'vue' && (['wx', 'baidu', 'alipay', 'qq'].includes(type))) {
    if (t.isJSXAttribute(node) && (node.name.name === 'v-if' ||
    node.name.name === 'v-else-if' ||
    node.name.name === 'v-else'
    )) {
      let currentCondition = node.name.name;
      let targetCondition = conditionMapVue2Wx[currentCondition][type];
      if (targetCondition && currentCondition !== targetCondition) {
        node.name.name = targetCondition;
        if (type === 'baidu') {
          // 不做处理
        } else {
          node.value && t.isStringLiteral(node.value) && (node.value.value = `{{${node.value.value}}}`);
        }

      }
    }
  }
})
parseVue2Wx.tap('vue2wx-v-bind,vue2alipay-v-bind', (args) => {
  let { node, type, options: {lang}} = args;
  if (lang === 'vue' && (['wx', 'baidu', 'alipay', 'qq'].includes(type))) {
    // 注意这个node节点仍然是 JSXAttribute节点；
    let bindAttrName = node.name;
    if (t.isJSXNamespacedName(bindAttrName) && bindAttrName.namespace.name === 'v-bind' && bindAttrName.name.name !== 'key' && bindAttrName.name.name !== 'class') {
      // key属性不要处理；class属性不要处理；
      let finalBindAttrName = bindAttrName.name && bindAttrName.name.name;
      if (finalBindAttrName) {
        node.name = t.jsxIdentifier(finalBindAttrName);
        node.value.value = `{{${node.value.value}}}`
      }
    }
  }
});
parseVue2Wx.tap('vue2wx-v-for', (args) => {
  let { path, node, type, options: {lang}} = args;
  if (lang === 'vue' && (['wx', 'baidu', 'alipay', 'qq'].includes(type))) {
    if (t.isJSXAttribute(node) && node.name.name === 'v-for') {
      let siblingPaths = utils.getSiblingPaths(path);
      let value = node.value && node.value.value;
      let {item, list, index} = utils.analysisFor(value);
      siblingPaths.forEach((siblingPath) => {
        let siblingPathNode = siblingPath.node;
        let keyAttrName = siblingPathNode.name;
        let keyValue = siblingPathNode.value && siblingPathNode.value.value;
        if (t.isJSXNamespacedName(keyAttrName) && keyAttrName.name.name === 'key') {
          if (keyValue === item) {
            keyValue = '*this'
          } else {
            let reg = new RegExp(`${item}\\.`, 'g');
            keyValue = keyValue.replace(reg, '');
          }
          if (keyValue) {
            // siblingPathNode.name = t.jsxIdentifier('wx:key');
            siblingPathNode.name = t.jsxIdentifier(interationMap['c-key'][type]);
            siblingPathNode.value.value = `${keyValue}`
          }
        }
      })
      if (type === 'baidu') {
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(interationMap['c-for'][type]), t.stringLiteral(`${list}`)));
      } else {
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(interationMap['c-for'][type]), t.stringLiteral(`{{${list}}}`)));
      }
      path.insertAfter(t.jsxAttribute(t.jsxIdentifier(interationMap['c-for-index'][type]), t.stringLiteral(`${index}`)));
      path.insertAfter(t.jsxAttribute(t.jsxIdentifier(interationMap['c-for-item'][type]), t.stringLiteral(`${item}`)));
      path.remove();
    }
  }
});
parseVue2Wx.tap('component-is', (args) => {
  let {path, node, type, options} = args;
  let lang = options.lang;
  let conditionMap = {
    wx: 'wx:if',
    alipay: 'a:if',
    baidu: 's-if',
    qq: 'qq:if'

  }
  let usingComponents = (options.usingComponents || []).map(item => item.tagName)
  if ((['wx', 'baidu', 'alipay', 'qq'].includes(type)) && t.isJSXElement(node)) {
    let currentTag = node.openingElement.name.name;
    let jsxElementChildren = node.children || [];
    if (currentTag === 'component') {
      let attributes = utils.getJSXElementAttrKeyValue(path);
      let shrinkcomponents = attributes.shrinkcomponents;
      if (shrinkcomponents) {
        usingComponents = shrinkcomponents.split(',').reduce((result, comp) => {
          comp = utils.trim(comp);
          if (comp) {
            result.push(comp);
          }
          return result;
        }, [])
      }
      let currentComp;
      (path.node.openingElement.attributes || []).forEach((attr) => {
        let attrName = attr.name
        if (lang === 'vue' && t.isJSXNamespacedName(attrName) && attrName.name.name === 'is') {
          currentComp = attr.value.value;
        }
        if (lang === 'cml' && t.isJSXIdentifier(attrName) && attrName.name === 'is') {
          currentComp = utils.trimCurly(attr.value.value);
        }

      })
      if (currentComp && usingComponents) {
        let elementAttributes = path.node.openingElement.attributes || [];
        usingComponents.forEach((comp) => {
          elementAttributes = JSON.parse(JSON.stringify(elementAttributes))
          let openTag = t.jsxOpeningElement(t.jsxIdentifier(comp), [t.jsxAttribute(t.jsxIdentifier(`${conditionMap[type]}`), t.stringLiteral(`{{${currentComp} === '${comp}'}}`))].concat(elementAttributes));
          let closeTag = t.jsxClosingElement(t.jsxIdentifier(comp))
          let insertNode = t.jsxElement(openTag, closeTag, jsxElementChildren, false);

          path.insertAfter(insertNode);
        })
      }
      path.remove();// 无论如何都要移除 component这个元素；
    }
  }
})

module.exports.parseVue2Wx = parseVue2Wx;
