
const cpx = require('../postcss/cpx.js');
const weexPlus = require('../postcss/weex-plus');
const addAlipayClassPlugin = require('../postcss/add-alipay-class');
const addAmapClassPlugin = require('../postcss/add-amap-class');
const postcss = require('postcss');

module.exports = function(source, options = {}) {
  options.cpxType = 'rpx';
  let {cmlType} = options;
  switch (cmlType) {
    case 'alipay':
      return postcss([cpx(options), weexPlus(), addAlipayClassPlugin(options)]).process(source).css;
    case 'amap':
      return postcss([cpx(options), weexPlus(), addAmapClassPlugin(options)]).process(source).css;
    default:
      return postcss([cpx(options), weexPlus()]).process(source).css;
  }
  // if (cmlType === 'alipay') {
  //   return postcss([cpx(options), weexPlus(), addAlipayClassPlugin(options)]).process(source).css;
  // } else {
  //   return postcss([cpx(options), weexPlus()]).process(source).css;

  // }

}
