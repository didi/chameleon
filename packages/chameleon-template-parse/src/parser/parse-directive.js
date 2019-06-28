const t = require('@babel/types')
const weexMixins = require('chameleon-mixins/weex-mixins.js')
const { SyncHook } = require("tapable");
const utils = require('../common/utils');
const eventProxy = require('chameleon-mixins/web-mixins.js');
const wxEventProxy = require('chameleon-mixins/wx-mixins.js');
let parseDirective = new SyncHook(['args'])
// cml语法
parseDirective.tap('web-weex-cml', (args) => {
  let { path, node, type, options: {lang}} = args;
  if (lang === 'cml' && (type === 'web' || type === 'weex')) {
    // 以下开始处理指令；
    // v-model c-model
    // web端因为是自定义组件触发的 input事件的参数不对，所以不能直接用vue的v-model
    if (t.isJSXAttribute(node) && node.name.name === 'c-model') {
      let modelKey = utils.getModelKey(node.value.value);
      path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`v-bind:value`), t.stringLiteral(modelKey)))
      path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`v-on:input`), t.stringLiteral(`${eventProxy.modelEventProxyName}($event,'${modelKey}')`)));

      path.remove();// 删除c-model属性节点；
    }
    // v-text c-text
    if (t.isJSXAttribute(node) && node.name.name === 'c-text') {
      let textValue = node.value.value;
      let JSXElemenetPath = path.find((pth) => pth.isJSXElement());
      JSXElemenetPath && (JSXElemenetPath.node.children = [t.jsxText(textValue)]);

      path.remove();// 删除c-text;
    }
    // c-show
    if (t.isJSXElement(node)) {
      let attributes = node.openingElement.attributes;
      let showDirectiveNode = attributes.find((attr, i) => {
        if (attr.name.name === 'c-show') {
          attributes.splice(i, 1);
        }
        return attr.name.name === 'c-show';
      });
      let styleNode = attributes.find((attr) => attr.name.name === 'style' || attr.name.name.name === 'style')
      if (!showDirectiveNode) {
        return ;
      }
      if (styleNode) {
        throw new Error(`The style attribute can't be used in the element that has  attributes with c-show `);
      }
      let elementShow = utils.trimCurly(showDirectiveNode.value.value);

      let styleNodeValue = `display:{{${elementShow}?'':'none'}};{{${elementShow}?'':'height:0px;width:0px;overflow:hidden'}}`
      if (type === 'weex') {
        attributes.push(t.jsxAttribute(t.jsxIdentifier(`style`), t.stringLiteral(styleNodeValue)))
      } else if (type === 'web') {
        attributes.push(t.jsxAttribute(t.jsxIdentifier(`v-show`), t.stringLiteral(elementShow)))
      }

    }
  }
});
parseDirective.tap('wx-baidu-qq-cml', (args) => {
  let { path, node, type, options: {lang} } = args;
  // type === 'wx' || type === 'baidu' || type === 'alipay'
  if (lang === 'cml' && (['wx', 'baidu', 'alipay', 'qq'].includes(type))) {
    // c-model
    if (t.isJSXAttribute(node) && node.name.name === 'c-model') {
      let modelKey = utils.getModelKey(node.value.value);
      path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`value`), t.stringLiteral(node.value.value)))
      if (type === 'alipay') {
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`onInput`), t.stringLiteral(`${wxEventProxy.modelEventProxyName}`)));
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-eventinput`), t.stringLiteral(`${wxEventProxy.modelEventProxyName}`)));
      } else {
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`bindinput`), t.stringLiteral(`${wxEventProxy.modelEventProxyName}`)));
      }
      path.replaceWith(t.jsxAttribute(t.jsxIdentifier(`data-modelkey`), t.stringLiteral(`${modelKey}`)))
    }
    // c-text
    if (t.isJSXAttribute(node) && node.name.name === 'c-text') {
      let textValue = node.value.value;
      let JSXElemenetPath = path.find((pth) => pth.isJSXElement());
      JSXElemenetPath && (JSXElemenetPath.node.children = [t.jsxText(textValue)]);

      path.remove();// 删除c-text;
    }
    // c-show
    if (t.isJSXElement(node)) {
      let attributes = node.openingElement.attributes;
      let showDirectiveNode = attributes.find((attr, i) => {
        if (attr.name.name === 'c-show') {
          attributes.splice(i, 1);
        }
        return attr.name.name === 'c-show';
      });
      let styleNode = attributes.find((attr) => attr.name.name === 'style' || attr.name.name.name === 'style')
      if (!showDirectiveNode) {
        return ;
      }
      if (styleNode) {
        throw new Error(`The style attribute can't be used in the element that has  attributes with c-show `);
      }
      let elementShow = utils.trimCurly(showDirectiveNode.value.value);

      let styleNodeValue = `display:{{${elementShow}?'':'none'}};{{${elementShow}?'':'height:0px;width:0px;overflow:hidden'}}`
      attributes.push(t.jsxAttribute(t.jsxIdentifier(`style`), t.stringLiteral(styleNodeValue)))
    }
  }
})

// vue语法
parseDirective.tap('web-weex-vue', (args) => {
  let { path, node, type, options: {lang}} = args;
  if (lang === 'vue' && (type === 'web' || type === 'weex')) {
    // 以下开始处理指令；
    // v-model
    if (t.isJSXAttribute(node) && node.name.name === 'v-model') {
      let modelKey = utils.getModelKey(node.value.value);
      path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`v-bind:value`), t.stringLiteral(modelKey)))
      path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`v-on:input`), t.stringLiteral(`${eventProxy.modelEventProxyName}($event,'${modelKey}')`)));

      path.remove();// 删除c-model属性节点；
    }
    // v-text
    if (t.isJSXAttribute(node) && node.name.name === 'v-text') {
      let textValue = node.value.value;
      let JSXElemenetPath = path.find((pth) => pth.isJSXElement());
      JSXElemenetPath && (JSXElemenetPath.node.children = [t.jsxText(`{{${textValue}}}`)]);

      path.remove();// 删除c-text;
    }
    // v-show
    if (t.isJSXElement(node)) {
      let attributes = node.openingElement.attributes;
      let showDirectiveNode = attributes.find((attr, i) => {
        if (attr.name.name === 'v-show') {
          attributes.splice(i, 1);
        }
        return attr.name.name === 'v-show';
      });
      let styleNode = attributes.find((attr) => attr.name.name === 'style' || attr.name.name.name === 'style')
      if (!showDirectiveNode) {
        return ;
      }
      if (styleNode) {
        throw new Error(`The style attribute can't be used in the element that has  attributes with v-show `);
      }
      let elementShow = utils.trimCurly(showDirectiveNode.value.value);

      let styleNodeValue = `display:{{${elementShow}?'':'none'}};{{${elementShow}?'':'height:0px;width:0px;overflow:hidden'}}`;
      if (type === 'weex' && styleNodeValue.indexOf('_cmlStyleProxy') === -1) {
        styleNodeValue = `${weexMixins.styleProxyName}(${utils.getReactiveValue(styleNodeValue)})`
      }
      if (type === 'weex') {
        attributes.push(t.jsxAttribute(t.jsxIdentifier(`:style`), t.stringLiteral(styleNodeValue)))
      } else if (type === 'web') {
        attributes.push(t.jsxAttribute(t.jsxIdentifier(`v-show`), t.stringLiteral(elementShow)))
      }

    }
  }
})

parseDirective.tap('wx-vue', (args) => {
  let { path, node, type, options: {lang} } = args;
  if (lang === 'vue' && (['wx', 'baidu', 'alipay', 'qq'].includes(type))) {
    if (t.isJSXAttribute(node) && node.name.name === 'v-model') {
      let modelKey = utils.getModelKey(node.value.value);
      path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`value`), t.stringLiteral(`{{${node.value.value}}}`)))
      if (type === 'alipay') {
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`onInput`), t.stringLiteral(`${wxEventProxy.modelEventProxyName}`)));
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`data-eventinput`), t.stringLiteral(`${wxEventProxy.modelEventProxyName}`)));
      } else {
        path.insertAfter(t.jsxAttribute(t.jsxIdentifier(`bindinput`), t.stringLiteral(`${wxEventProxy.modelEventProxyName}`)))
      }
      path.replaceWith(t.jsxAttribute(t.jsxIdentifier(`data-modelkey`), t.stringLiteral(`${modelKey}`)))
    }
    // v-text c-text
    if (t.isJSXAttribute(node) && node.name.name === 'v-text') {
      let textValue = node.value.value;
      let JSXElemenetPath = path.find((pth) => pth.isJSXElement());
      JSXElemenetPath && (JSXElemenetPath.node.children = [t.jsxText(`{{${textValue}}}`)]);

      path.remove();// 删除v-text;
    }
    if (t.isJSXElement(node)) {
      let attributes = node.openingElement.attributes;
      let showDirectiveNode = attributes.find((attr, i) => {
        if (attr.name.name === 'v-show') {
          attributes.splice(i, 1);
        }
        return attr.name.name === 'v-show';
      });
      let styleNode = attributes.find((attr) => attr.name.name === 'style' || attr.name.name.name === 'style')
      if (!showDirectiveNode) {
        return ;
      }
      if (styleNode) {
        throw new Error(`The style attribute can't be used in the element that has  attributes with v-show `);
      }
      let elementShow = utils.trimCurly(showDirectiveNode.value.value);

      let styleNodeValue = `display:{{${elementShow}?'':'none'}};{{${elementShow}?'':'height:0px;width:0px;overflow:hidden'}}`;

      attributes.push(t.jsxAttribute(t.jsxIdentifier(`style`), t.stringLiteral(styleNodeValue)))
    }
  }
})


module.exports.parseDirective = parseDirective;
