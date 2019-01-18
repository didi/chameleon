var getMiniAppCommonConfig = require('./getMiniAppCommonConfig.js');
var merge = require('webpack-merge')

module.exports = function (options) {
  return merge(getMiniAppCommonConfig(options), {})
}
