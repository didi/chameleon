
const t = require('@babel/types');
const {parseCondition} = require('./parse-condition.js');
const {parseEvent} = require('./parse-event.js');
const {parseInteration} = require('./parse-interation.js');
const {parseAttribute} = require('./parse-attribute.js');
const {parseStyle} = require('./parse-style.js');
const {parseVue2Wx} = require('./parse-vue2wx.js');
const {parseAnimationTag} = require('./parse-animation-tag.js');
const {parseDirective} = require('./parse-directive.js');
const {parseClass} = require('./parse-class.js');
const {parseRef} = require('./parse-ref.js');
const {parseTextContent} = require('./parse-text-content.js');
const alipayMixins = require('chameleon-mixins/alipay-mixins.js');

const {
  tagMap
} = require('../common/cml-map.js')


/**
 * 解析原则:
 * 1 只处理需要处理的，不需要处理的，不满足条件则不做任何操作；
 * 2 为了保证解析过程的正确性，即只处理需要处理的节点，按照 节点类型 --> 平台类型 --> 这样的流程进行判断；
 *
 *
*/
// web wx weex
exports.parseTag = function (path, type) {
  let node = path.node;
  if (t.isJSXElement(node)) {
    let currentTag = node.openingElement.name.name;
    let targetTag = tagMap.targetTagMap[currentTag] && tagMap.targetTagMap[currentTag][type];

    if (targetTag && currentTag !== targetTag) {
      node.openingElement.name.name = targetTag;
      // 这里要处理自闭和标签，没有closingElement，所以做个判断；
      node.closingElement && (node.closingElement.name.name = targetTag);

    }
  }
}
exports.afterParseTag = function (path, type) {
  let node = path.node;
  if (t.isJSXElement(node)) {
    let currentTag = node.openingElement.name.name;
    let targetTag = tagMap.afterTagMap[currentTag] && tagMap.afterTagMap[currentTag][type];

    if (targetTag && currentTag !== targetTag) {
      node.openingElement.name.name = targetTag;
      node.closingElement && (node.closingElement.name.name = targetTag);
    }
  }
}
exports.parseOriginTag = function(path, type) {
  let node = path.node;
  if (t.isJSXElement(node) && (node.openingElement.name && typeof node.openingElement.name.name === 'string')) {
    if (node.openingElement.name.name.indexOf('origin-') === 0) {
      let currentTag = node.openingElement.name.name;
      let targetTag = currentTag.replace('origin-', '')
      node.openingElement.name.name = targetTag;
      node.closingElement && (node.closingElement.name.name = targetTag);
    }

  }
}
exports.parseBuildTag = function (path, type, options) {
  let node = path.node;
  let buildInTagMap = options && options.buildInComponents;// {button:"cml-buildin-button"}
  if (t.isJSXElement(node) && buildInTagMap) {
    let currentTag = node.openingElement.name.name;
    let targetTag = buildInTagMap[currentTag];
    // 收集用了哪些内置组件 usedBuildInTagMap:{button:'cml-buildin-button',radio:'cml-buildin-radio'}
    let usingComponents = (options.usingComponents || []).map(item => item.tagName)
    // 兼容用户自己写了组件和内置组件重名
    let isUserComponent = usingComponents.includes(currentTag);
    if (isUserComponent) { // 如果是用户的内置组件，这里不做任何处理，直接返回
      return;
    } else {
      if (targetTag && currentTag !== targetTag) {
        node.openingElement.name.name = targetTag;
        node.closingElement && (node.closingElement.name.name = targetTag);
        (!options.usedBuildInTagMap) && (options.usedBuildInTagMap = {});
        options.usedBuildInTagMap[currentTag] = targetTag;
      }
    }
  }
}
// 配合安震，解析c-slider;
exports.parseTagForSlider = function(path, type, options) {
  let node = path.node;
  if ((type === 'wx' || type === 'baidu' || type === 'alipay') && t.isJSXElement(node)) {
    let currentTag = node.openingElement.name.name;
    let targetTag = tagMap.wxTagMap[currentTag];
    if (targetTag && currentTag !== targetTag) {
      node.openingElement.name.name = targetTag;
      node.closingElement && (node.closingElement.name.name = targetTag);
    }
  }
}
exports.parseTextContentStatement = function parseTextContentStatement(path, type) {
  let node = path.node;
  if (t.isJSXElement(node)) {
    parseTextContent.call({path, type, node})
  }
  // if(t.isJSXText(node)){
  //   parseTextContent.call({path,type,node})
  // }
}
exports.parseRefStatement = function parseRefStatement(path, type) {
  let node = path.node;
  if (t.isJSXAttribute(node) && node.name.name === 'ref') {
    parseRef.call({path, type, node});
  }
}
// web weex wx ...只处理cml语法  c-if c-else-if c-else
exports.parseConditionalStatement = function parseConditionalStatement(path, type, options) {
  let node = path.node;
  if (t.isJSXAttribute(node) && (node.name.name === 'c-if' ||
  node.name.name === 'c-else-if' ||
  node.name.name === 'c-else'
  )) {
    parseCondition.call({path, type, node, options})
  }
}
// web weex wx  只处理cml语法 c-bind c-catch
exports.parseEventListener = function parseEventListener(path, type, options) {
  let node = path.node;
  // 对于 JSXNamespaceName节点，仅仅需要处理 c-catch c-bind的情况，其他的不要进行处理
  if (t.isJSXNamespacedName(node) && (node.namespace.name === 'c-catch' || node.namespace.name === 'c-bind')) {
    parseEvent.call({path, type, node, options})
  }
}
exports.parseAddAliEventProps = function parseAddAliEventProps(path, type, options) {
  let node = path.node;
  if (t.isJSXElement(node)) {
    let attributes = node.openingElement.attributes || [];
    let hasEventBind = attributes.find((attr) => (t.isJSXNamespacedName(attr.name) && attr.name.namespace.name === 'c-bind'));
    if (hasEventBind) {
      attributes.push(t.jsxAttribute(t.jsxIdentifier(alipayMixins.cmlPropsEventProxy.key), t.stringLiteral(alipayMixins.cmlPropsEventProxy.value)));
    }
  }
}
// 只支持数组，小程序不支持对象的for循环；
// web weex wx   只处理cml语法   c-for
exports.parseIterationStatement = function parseIterationStatement(path, type, options) {
  let node = path.node;
  if (t.isJSXAttribute(node) && node.name.name === 'c-for') {
    parseInteration.call({path, node, type, options});
  }
}
// 处理所有的属性，将其转化为计算属性 {{}}中转换成vue属性表达式    class="a+{{b}}"  -> :class = "'a'+(b)"
// web weex wx
exports.parseAttributeStatement = function parseAttributeStatement(path, type) {
  let node = path.node;
  // 将 {{}}语法转化为动态值得时候，不处理class和style，这个方法是将wx中的props={{}}的语法转化为 v-bind:props="sth"的形式；
  if (t.isJSXAttribute(node) && node.name.name !== 'class' && node.name.name !== 'style' &&
  node.name.name.name !== 'class' && node.name.name.name !== 'style'
  ) {
    parseAttribute.call({path, node, type});
  }
};
exports.parseStyleStatement = function parseStyleStatement(path, type, options) {
  let node = path.node;
  // node.name.name === 'style' (代表静态style) == node.name.name.name === 'style' (代表动态style)
  if (t.isJSXAttribute(node) && (node.name.name === 'style' || node.name.name.name === 'style')) {
    parseStyle.call({path, node, type, options});
  }
}
exports.parseClassStatement = function parseClassStatement(path, type, options) {
  let node = path.node;
  if (t.isJSXElement(node)) {
    parseClass.call({path, node, type, options});
  }
}
exports.parseAnimationStatement = function parseAnimationStatement(path, type) {
  let node = path.node;
  // 由于微信端组件的名的标签会被渲染为一个单独的标签，所以需要这个hack;
  if (t.isJSXAttribute(node) && node.name.name === 'c-animation') {
    parseAnimationTag.call({path, node, type});
  }

}

exports.parseVue2WxStatement = function parseVue2WxStatement(path, type, options) {
  let node = path.node;
  node && parseVue2Wx.call({path, node, type, options});
}
exports.parseDirectiveStatement = function parseDirectiveStatement(path, type, options) {
  let node = path.node;

  node && parseDirective.call({path, node, type, options})
}

