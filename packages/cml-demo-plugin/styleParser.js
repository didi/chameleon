const postcss = require('postcss');
const cpx = require('chameleon-css-loader/postcss/cpx.js')
const weexPlus = require('chameleon-css-loader/postcss/weex-plus.js')

module.exports = function(source) {
  let options = {
    cpxType: 'rpx'
  }
  return postcss([cpx(options), weexPlus()]).process(source).css;
}