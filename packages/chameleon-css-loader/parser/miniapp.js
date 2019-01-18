
const cpx = require('../postcss/cpx.js');
module.exports = function(source, options = {}) {
  options.cpxType = 'rpx';
  return cpx(source, options);
}
