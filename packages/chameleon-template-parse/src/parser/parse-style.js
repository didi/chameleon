// --inspect-brk
const t = require('@babel/types')

const { SyncHook } = require('tapable');
const utils = require('../common/utils');

const weexMixins = require('chameleon-mixins/weex-mixins.js')
const webMixins = require('chameleon-mixins/web-mixins.js')
const webStaticStyleHandle = require('chameleon-css-loader/proxy/proxyWeb.js');
const wxStaticStyleHandle = require('chameleon-css-loader/proxy/proxyMiniapp.js');
const weexStaticStyleHandle = require('chameleon-css-loader/transform/weex.js')

let parseStyle = new SyncHook(['args'])
// cml语法下只能一个style属性
parseStyle.tap('web-cml', (args) => {
  let { node, type, options: { lang, cmss } } = args;
  if (!cmss) {
    throw new Error('please ensure that if you configed the cmss in chameleon.config.js');
  }
  if (lang === 'cml' && type === 'web') {
    let styleNode = node;
    let cmssString = utils.doublequot2singlequot(JSON.stringify(cmss));
    // 动态的style,包装成代理函数；
    if (styleNode && styleNode.value && utils.isMustacheReactive(styleNode.value.value)) {
      styleNode.value.value = utils.getReactiveValue(styleNode.value.value);

      styleNode.value.value = `${webMixins.styleProxyName}((${styleNode.value.value}),${cmssString})`
      styleNode.name.name = `:${styleNode.name.name}`;
    } else { // 静态的
      styleNode.value.value = webStaticStyleHandle(styleNode.value.value, cmssString);
    }

  }
});
parseStyle.tap('weex-cml', (args) => {
  let { node, type, options: { lang } } = args;
  if (lang === 'cml' && type === 'weex') {
    let styleNode = node
    if (styleNode && styleNode.value && utils.isMustacheReactive(styleNode.value.value)) {
      // weex动态style
      styleNode.value.value = utils.getReactiveValue(styleNode.value.value);
      styleNode.value.value = `${weexMixins.styleProxyName}((${styleNode.value.value}))`
      styleNode.name.name = `:${styleNode.name.name}`;
    } else { // weex静态style

      styleNode.value && (styleNode.value.value = weexStaticStyleHandle.parse(styleNode.value.value));
    }
  }
});
parseStyle.tap('wx-alipay-baidu-cml', (args) => {
  let { node, type, options: { lang } } = args;
  if (lang === 'cml' && (['wx', 'baidu', 'alipay', 'qq', 'tt'].includes(type))) {
    let styleNode = node
    if (styleNode && styleNode.value && utils.isMustacheReactive(styleNode.value.value)) {// 动态的style  cpx转化成rpx
      styleNode.value && (styleNode.value.value = utils.transformWxDynamicStyleCpxToRpx(styleNode.value.value));
    } else { // 静态的style
      styleNode.value && (styleNode.value.value = wxStaticStyleHandle(styleNode.value.value));
    }
  }
})
parseStyle.tap('web-vue', (args) => {
  let { node, type, options: { lang, cmss } } = args;
  if (!cmss) {
    throw new Error('please ensure that if you configed the cmss in chameleon.config.js');
  }
  if (lang === 'vue' && type === 'web') {
    // web端处理动态style；
    let styleNode = node;
    let cmssString = utils.doublequot2singlequot(JSON.stringify(cmss));
    if (t.isJSXNamespacedName(node.name)) {
      styleNode.value.value = `${webMixins.styleProxyName}((${styleNode.value.value}),${cmssString})`
    } else { // 静态
      styleNode.value.value = webStaticStyleHandle(styleNode.value.value, cmssString);
    }
  }
});
parseStyle.tap('weex-vue', (args) => {
  let { node, type, options: { lang } } = args;
  if (lang === 'vue' && type === 'weex') {
    let styleNode = node;
    if (styleNode) {
      if (t.isJSXNamespacedName(styleNode.name)) {
        styleNode.value.value = `${weexMixins.styleProxyName}((${styleNode.value.value}))`
      } else { // 静态的
        // styleNode.value && (styleNode.value.value = styleHandle(styleNode.value.value));
        styleNode.value && (styleNode.value.value = weexStaticStyleHandle.parse(styleNode.value.value));
      }
    }
  }
});
parseStyle.tap('miniapp-vue', (args) => {
  let { path, node, type, options: { lang } } = args;
  if (lang === 'vue' && (['wx', 'baidu', 'alipay', 'qq', 'tt'].includes(type))) {
    let styleNode = node;
    if (styleNode) {
      let newStyleNodeValue;
      if (t.isJSXNamespacedName(styleNode.name)) {
        try {
          newStyleNodeValue = utils.transformWxDynamicStyleCpxToRpx(`{{${styleNode.value.value}}}`);
          path.replaceWith(t.jsxAttribute(t.jsxIdentifier('style'), t.stringLiteral(newStyleNodeValue)));
        } catch (err) {
          throw new Error(`${type} platform with ${lang} syntax，the attributes style is not correct`);
        }
      } else if (styleNode.value && !utils.isMustacheReactive(styleNode.value.value)) { // 静态的
        styleNode.value && (styleNode.value.value = wxStaticStyleHandle(styleNode.value.value));
      }
    }
  }
})


module.exports.parseStyle = parseStyle;
