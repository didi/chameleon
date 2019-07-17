const { SyncHook } = require("tapable");
const utils = require('../common/utils');
const t = require('@babel/types');
const weexMixins = require('chameleon-mixins/weex-mixins.js')
// weex: 不支持<view><text class="{{true? 'bg-green font':''}}" >fafafa</text></view>。也就注定不能这么写多个class ,但是可以 class="cls1 cls2 cls3"
let parseClass = new SyncHook(['args']);
const hash = require('hash-sum');
// weex对于动态样式的处理  简直 amazing
// cml语法：支持的写法如下：class="cls1 cls2"  class="{{true ? 'cls1 cls2':'cls3 cls4'}}"
/**
 *<view><text class="cls1 cls2 {{index}}">test class1</text></view>
  <view><text class="cls1 cls2 cls-{{index}}">test class1</text></view>
  <view><text class="cls1 cls2 {{true ? 'cls1':'cls2'}}">test class1</text></view>
*/
parseClass.tap('web-cml', (args) => {
  let { node, type, options: {lang, isInjectBaseStyle} } = args;
  if (lang === 'cml' && type === 'web') {
    let tagName = node.openingElement.name.name;
    let attributes = node.openingElement.attributes;
    let classNodes = attributes.filter((attr) => // 如果没有符合条件的classNodes则返回一个空数组
      attr.name.name === 'class'
    );
    let extraClass = '';
    if (isInjectBaseStyle) {
      extraClass = ` cml-base cml-${tagName}`;
    }
    if (classNodes.length === 0) {
      extraClass && attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
    } else if (classNodes.length === 1) {
      classNodes.forEach((itemNode) => {
        const dealedClassNodeValue = `${itemNode.value.value} ${extraClass}`;
        if (utils.isMustacheReactive(itemNode.value.value)) { // 包括动态class
          const newClassNodeValue = utils.getReactiveValue(dealedClassNodeValue);
          itemNode.name.name = `v-bind:${itemNode.name.name}`
          itemNode.value.value = `(${newClassNodeValue})`
        } else { // 静态class
          itemNode.value.value = dealedClassNodeValue
        }
      })
    } else {
      throw new Error(`Only allow one class node in element's attribute with cml syntax`);
    }
  }

})
parseClass.tap('weex-cml', (args) => {
  let { node, type, options: {lang, isInjectBaseStyle} } = args;
  if (lang === 'cml' && type === 'weex') {
    let tagName = node.openingElement.name.name;
    let attributes = node.openingElement.attributes;
    let classNodes = attributes.filter((attr) => // 如果没有符合条件的classNodes则返回一个空数组
      attr.name.name === 'class'
    );
    let extraClass = '';
    if (isInjectBaseStyle) {
      extraClass = ` cml-base cml-${tagName}`;
    }
    if (classNodes.length === 0) {
      extraClass && attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
    } else if (classNodes.length === 1) {
      classNodes.forEach((itemNode) => {
        if (utils.isMustacheReactive(itemNode.value.value)) { // 动态的
          const dealedClassNodeValue = `${extraClass} ${itemNode.value.value}` ;
          itemNode.name.name = `:${itemNode.name.name}`
          const newDynamicClassNodeValue = utils.getReactiveValue(dealedClassNodeValue);
          itemNode.value.value = `${weexMixins.weexClassProxy}(${newDynamicClassNodeValue})`
        } else {
          itemNode.name.name = `:${itemNode.name.name}`
          const newStaticClassNodeValue = `${extraClass} ${itemNode.value.value}`
          itemNode.value.value = `${weexMixins.weexClassProxy}('${newStaticClassNodeValue}')`
        }

      })
    } else {
      throw new Error(`Only allow one class node in element's attribute with cml syntax`);
    }

  }

})
parseClass.tap('wx-alipay-baidu-cml', (args) => {
  let { node, type, options: {lang, filePath, usingComponents, isInjectBaseStyle} } = args;
  // type === 'wx' || type === 'alipay' || type === 'baidu'
  if (lang === 'cml' && (['wx', 'qq', 'baidu', 'alipay'].includes(type))) {
    let tagName = node.openingElement.name.name;
    let attributes = node.openingElement.attributes;
    let classNodes = attributes.filter((attr) => // 如果没有符合条件的classNodes则返回一个空数组
      attr.name.name === 'class'
    );
    let isUsingComponents = (usingComponents || []).find((comp) => comp.tagName === tagName);
    let extraClass = '';
    if (['wx', 'qq', 'baidu'].includes(type)) {
      if (isInjectBaseStyle) {
        extraClass = ` cml-base cml-${tagName}`;
        if (isUsingComponents) {
          extraClass = ` cml-view cml-${tagName}`;
        }
      }
    }
    if (type === 'alipay') {
      let randomClassName = hash(filePath);
      if (isInjectBaseStyle) {
        extraClass = ` cml-base cml-${tagName}`;
        extraClass = `${extraClass} cml-${randomClassName}`
      } else {
        extraClass = `${extraClass} cml-${randomClassName}` // 不插入全局样式的时候也要插入样式隔离
      }
    }

    if (classNodes.length === 0) {
      extraClass && attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral(extraClass)))
    } else if (classNodes.length === 1) {
      classNodes.forEach((itemNode) => {
        const dealedClassNodeValue = `${itemNode.value.value} ${extraClass}`
        itemNode.value.value = dealedClassNodeValue;
      })
    } else {
      throw new Error(`Only allow one class node in element's attribute with cml syntax`);
    }
  }

})
// vue语法：class='cls1 cls2' :class="true ? 'cls1 cls2 cls3' : 'cls4 cls5 cls6'"
parseClass.tap('web-vue', (args) => {
  let { node, type, options: {lang, isInjectBaseStyle} } = args;
  if (lang === 'vue' && type === 'web') {
    let tagName = node.openingElement.name.name;
    let attributes = node.openingElement.attributes;
    let classNodes = attributes.filter((attr) => // 如果没有符合条件的classNodes则返回一个空数组
      attr.name.name === 'class' || attr.name.name.name === 'class'
    );
    let extraClass = '';
    if (isInjectBaseStyle) {
      extraClass = ` cml-base cml-${tagName}`;
    }
    utils.handleVUEClassNodes({classNodes, attributes, extraClass, lang, type})
  }

})
parseClass.tap('weex-vue', (args) => {
  let { node, type, options: {lang, isInjectBaseStyle} } = args;
  if (lang === 'vue' && type === 'weex') {
    let tagName = node.openingElement.name.name;
    let attributes = node.openingElement.attributes;
    let classNodes = attributes.filter((attr) => // 如果没有符合条件的classNodes则返回一个空数组
      attr.name.name === 'class' || attr.name.name.name === 'class'
    );
    let extraClass = '';
    if (isInjectBaseStyle) {
      extraClass = ` cml-base cml-${tagName}`;
    }
    utils.handleVUEClassNodes({classNodes, attributes, extraClass, lang, type})
  }

})
parseClass.tap('wx-alipay-baidu-vue', (args) => {
  let { node, type, options: {lang, filePath, usingComponents, isInjectBaseStyle} } = args;
  // (type === 'wx' || type === 'alipay' || type === 'baidu')
  if (lang === 'vue' && (['wx', 'qq', 'baidu', 'alipay'].includes(type))) {
    let tagName = node.openingElement.name.name;
    let attributes = node.openingElement.attributes;
    let classNodes = attributes.filter((attr) => // 如果没有符合条件的classNodes则返回一个空数组
      attr.name.name === 'class' || attr.name.name.name === 'class'
    );
    let isUsingComponents = (usingComponents || []).find((comp) => comp.tagName === tagName);
    let extraClass = '';
    if (['wx', 'qq', 'baidu'].includes(type)) {
      if (isInjectBaseStyle) {
        extraClass = ` cml-base cml-${tagName}`;
        if (isUsingComponents) {
          extraClass = ` cml-view cml-${tagName}`;
        }
      }
    }
    if (type === 'alipay') {
      let randomClassName = hash(filePath);
      if (isInjectBaseStyle) {
        extraClass = ` cml-base cml-${tagName}`;
        extraClass = `${extraClass} cml-${randomClassName}`
      } else {
        extraClass = `${extraClass} cml-${randomClassName}` // 不插入全局样式的时候也要插入样式隔离
      }
    }
    utils.handleVUEClassNodes({classNodes, attributes, extraClass, lang, type: 'miniapp'})
  }

})


module.exports.parseClass = parseClass;
