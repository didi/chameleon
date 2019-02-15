
const cpx = require('../postcss/cpx.js');
const postcss = require('postcss');
const px2rem = require('postcss-plugin-px2rem');
const weexPlus = require('../postcss/weex-plus');
module.exports = function(source, options = {}) {
  if (options.rem === true) {
    return postcss([px2rem(options.remOptions), weexPlus()]).process(source).css;
  } else {
    options.cpxType = 'scale';
    return postcss([cpx(options), weexPlus()]).process(source).css;
  }
}
