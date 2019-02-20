
const cpx = require('../postcss/cpx.js');
const weexPlus = require('../postcss/weex-plus');
const postcss = require('postcss');

module.exports = function(source, options = {}) {
  options.cpxType = 'rpx';
  return postcss([cpx(options), weexPlus()]).process(source).css;

}
