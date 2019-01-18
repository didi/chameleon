
const rem = require('../postcss/rem.js');
const cpx = require('../postcss/cpx.js');
module.exports = function(source, options = {}) {
  if (options.rem === true) {
    return rem(source, options);
  } else {
    options.cpxType = 'scale';
    return cpx(source, options);
  }
}
