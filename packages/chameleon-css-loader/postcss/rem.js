
const pxtorem = require('postcss-plugin-px2rem');
const postcss = require('postcss');
module.exports = function (content, options) {
  let ret = postcss(pxtorem(options.remOptions)).process(content).css;
  return ret;
}
