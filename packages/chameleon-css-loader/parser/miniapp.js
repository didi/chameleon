
const cpx = require('../postcss/cpx.js');
const weexPlus = require('../postcss/weex-plus');
const addAlipayClassPlugin = require('../postcss/add-alipay-class')
const postcss = require('postcss');

module.exports = function(source, options = {}) {
  options.cpxType = 'rpx';
  let {cmlType, filePath} = options;
  let globalCssPath = [`chameleon-runtime/src/platform/${cmlType}/style/index.css`, `chameleon-runtime/src/platform/${cmlType}/style/page.css`];
  let isGlobalCss = globalCssPath.some((item) => filePath.includes(item))
  if (cmlType === 'alipay' && !isGlobalCss) {
    return postcss([cpx(options), weexPlus(), addAlipayClassPlugin(options)]).process(source).css;
  } else {
    return postcss([cpx(options), weexPlus()]).process(source).css;

  }

}
