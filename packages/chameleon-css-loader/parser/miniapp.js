
const cpx = require('../postcss/cpx.js');
const weexPlus = require('../postcss/weex-plus');
const addAlipayClassPlugin = require('../postcss/add-alipay-class')
const postcss = require('postcss');
const cmlUtils = require('chameleon-tool-utils');
module.exports = function(source, options = {}) {
  options.cpxType = 'rpx';
  let {cmlType, filePath} = options;
  let globalCssPath = [`chameleon-runtime/src/platform/${cmlType}/style/index.css`, `chameleon-runtime/src/platform/${cmlType}/style/page.css`];
  let globalStyleConfig = cml.config.get().globalStyleConfig;
  if (globalStyleConfig && globalStyleConfig.globalCssPath && cmlUtils.isFile(globalStyleConfig.globalCssPath)) {
    globalCssPath.push(globalStyleConfig.globalCssPath)
  }
  let isGlobalCss = globalCssPath.some((item) => filePath.includes(item))
  if (cmlType === 'alipay' && !isGlobalCss) { // 对于全局样式不能经过 addAlipayClassPlugin 这个插件进行样式唯一性的处理；比如这样的 .cml-57b5135a.scroller-wrap
    return postcss([cpx(options), weexPlus(), addAlipayClassPlugin(options)]).process(source).css;
  } else {
    return postcss([cpx(options), weexPlus()]).process(source).css;

  }

}
