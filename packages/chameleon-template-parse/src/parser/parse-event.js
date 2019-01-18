const t = require('@babel/types')

const { SyncHook } = require("tapable");
const {
  eventMap
} = require('../common/cml-map.js');
const utils = require('../common/utils');
const eventProxy = require('chameleon-mixins/web-mixins.js');
const wxEventProxy = require('chameleon-mixins/wx-mixins.js');
let parseEvent = new SyncHook(['args'])

parseEvent.tap('web-weex', (args) => {
  let { path, node, type, options} = args;
  if (type === 'web' || type === 'weex') {
    let container = path.container;
    let value = container.value;
    if (node.namespace.name === 'c-catch') {
      node.namespace.name = `${node.name.name}.stop`;
    }
    node.name.name === 'tap' && (node.name.name = 'click');
    node.namespace.name = 'v-on';
    // ====这里作用是阻止对 origin-tag标签的事件进行代理
    let jsxElementNodePath = path.findParent((path) => t.isJSXElement(path.node));
    let jsxElementNode = jsxElementNodePath.node;
    let usedComponentInfo = (options.usingComponents || []).find((item) => item.tagName === jsxElementNode.openingElement.name.name)
    let isNative = usedComponentInfo && usedComponentInfo.isNative;
    let isOrigin = (jsxElementNode.openingElement.name && typeof jsxElementNode.openingElement.name.name === 'string' && jsxElementNode.openingElement.name.name.indexOf('origin-') === 0);
    if (isOrigin || isNative) {
      return;
    }
    // ====这里作用是阻止对 origin-tag标签的事件进行代理

    // 这里代理事件的时候，需要区分是内联事件还是单纯的事件名，c-bind:click="makeCountUp()" c-bind:click="handleClick(item,1,'1',  'index')";和单纯的事件名 c-bind:click="makeCountUp"
    let handler = value.value && utils.trim(value.value);

    let match = utils.isInlineStatementFn(handler);
    if (!match) {
      // 不是内联函数执行语句 handler => "handleClick"
      value.value = `${eventProxy.eventProxyName}($event,'${handler}')`;
    } else {
      // handler ==> handleClick() handleClick(item,1,2) ..
      // 如果是 handleClick()  handleClick(item,name,1,2,"item","1",'2',true,"true")两种情况
      let index = handler.indexOf('(');
      index > 0 && (handler = utils.trim(handler.slice(0, index)));
      if (!utils.trim(match[1])) { // 对应handleClick(   ) 中的括号中的值；
        value.value = `${eventProxy.inlineStatementEventProxy}('${handler}')`
      } else { // handleClick(item,name,1,2,"item","1",'2',true,"true")
        let args = match && utils.doublequot2singlequot(match[1]);
        value.value = `${eventProxy.inlineStatementEventProxy}('${handler}',${args})`
      }

    }

  }
})
parseEvent.tap('wx-baidu', (args) => {
  let { path, node, type, options} = args;
  if (type === 'wx' || type === 'baidu') {
    let container = path.container;
    let value = container.value;
    let parentPath = path.parentPath;
    let name = node.name.name === 'click' ? 'tap' : node.name.name;
    let wxName = node.name.name === 'click' ? 'tap' : node.name.name;
    let handler = value.value && utils.trim(value.value);
    let match = utils.isInlineStatementFn(handler);
    if (node.namespace.name === 'c-bind') {
      wxName = `bind${wxName}`
    } else if (node.namespace.name === 'c-catch') {
      wxName = `catch${wxName}`
    }
    path.replaceWith(t.jsxIdentifier(wxName));
    // ====这里作用是阻止对 origin-tag标签的事件进行代理
    let jsxElementNodePath = path.findParent((path) => t.isJSXElement(path.node));
    let jsxElementNode = jsxElementNodePath.node;
    let usedComponentInfo = (options.usingComponents || []).find((item) => item.tagName === jsxElementNode.openingElement.name.name)

    let isNative = usedComponentInfo && usedComponentInfo.isNative;
    let isOrigin = (jsxElementNode.openingElement.name && typeof jsxElementNode.openingElement.name.name === 'string' && jsxElementNode.openingElement.name.name.indexOf('origin-') === 0);
    if (isOrigin || isNative) {
      return;
    }
    // ====这里作用是阻止对 origin-tag标签的事件进行代理
    if (!match) {
      parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-event${name}`), t.stringLiteral(handler)))
      value.value = `${wxEventProxy.eventProxyName}`;
    } else {
      let index = handler.indexOf('(');
      index > 0 && (handler = utils.trim(handler.slice(0, index)));
      value.value = `${eventProxy.inlineStatementEventProxy}`;
      let args = match && utils.doublequot2singlequot(match[1]);
      parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-event${name}`), t.stringLiteral(handler)))
      parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-args`), t.stringLiteral(args)))
      if (args) {
        args.split(',').forEach((arg, index) => {
          arg = utils.trim(arg);
          let argMatch = utils.isReactive(arg);
          if (!argMatch) {
            if (arg === "$event") {
              parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-arg${index}`), t.stringLiteral(arg)));
            } else {
              parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-arg${index}`), t.stringLiteral(`{{${arg}}}`)))
            }
          } else { // 字符串形式
            parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-arg${index}`), t.stringLiteral(argMatch[1])))
          }
        })
      }
    }
  }
})
parseEvent.tap('alipay', (args) => {
  // 这里注意和wx的不同，wx  bindtap="tapName"  alipay  onTap="tapName" on后面必须是大写字母；
  let { path, node, type, options} = args;
  if (type === 'alipay') {
    let container = path.container;
    let value = container.value;
    let parentPath = path.parentPath;
    let name = node.name && node.name.name;// alipay需要将事件名称转化成大写；
    let aliName = utils.titleLize(eventMap[name] || name);
    let handler = value.value && utils.trim(value.value);
    let match = utils.isInlineStatementFn(handler);
    if (node.namespace.name === 'c-bind') {
      aliName = `on${aliName}`
    } else if (node.namespace.name === 'c-catch') {
      aliName = `catch${aliName}`
    }
    path.replaceWith(t.jsxIdentifier(aliName));
    // ====这里作用是阻止对 origin-tag标签的事件进行代理
    let jsxElementNodePath = path.findParent((path) => t.isJSXElement(path.node));
    let jsxElementNode = jsxElementNodePath.node;
    let usedComponentInfo = (options.usingComponents || []).find((item) => item.tagName === jsxElementNode.openingElement.name.name)
    let isNative = usedComponentInfo && usedComponentInfo.isNative;
    let isOrigin = (jsxElementNode.openingElement.name && typeof jsxElementNode.openingElement.name.name === 'string' && jsxElementNode.openingElement.name.name.indexOf('origin-') === 0);
    if (isOrigin || isNative) {
      return;
    }
    // ====这里作用是阻止对 origin-tag标签的事件进行代理
    if (!match) {
      parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-event${name}`), t.stringLiteral(handler)))
      value.value = `${wxEventProxy.eventProxyName}`;
    } else {
      let index = handler.indexOf('(');
      index > 0 && (handler = utils.trim(handler.slice(0, index)));
      value.value = `${eventProxy.inlineStatementEventProxy}`;
      let args = match && utils.doublequot2singlequot(match[1]);
      parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-event${name}`), t.stringLiteral(handler)))
      parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-args`), t.stringLiteral(args)))
      if (args) {
        args.split(',').forEach((arg, index) => {
          arg = utils.trim(arg);
          let argMatch = utils.isReactive(arg);
          if (!argMatch) {
            if (arg === "$event") {
              parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-arg${index}`), t.stringLiteral(arg)));
            } else {
              parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-arg${index}`), t.stringLiteral(`{{${arg}}}`)))
            }
          } else { // 字符串形式
            parentPath.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-arg${index}`), t.stringLiteral(argMatch[1])))
          }
        })
      }
    }
  }
});
module.exports.parseEvent = parseEvent;
