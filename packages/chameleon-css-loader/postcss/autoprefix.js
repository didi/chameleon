
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
module.exports = function (content, options) {
  let ret = postcss(autoprefixer(options.autoprefixOptions)).process(content).css;
  return ret;
}
