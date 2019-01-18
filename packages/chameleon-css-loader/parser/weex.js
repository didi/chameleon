
const weex = require('../postcss/weex.js');
module.exports = function(source, options = {}) {
  return weex(source, options);
}
