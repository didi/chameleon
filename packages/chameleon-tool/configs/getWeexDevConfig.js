var getWeexCommonConfig = require('./getWeexCommonConfig.js');
var merge = require('webpack-merge');
const config = require('./config.js');
const webpack = require('webpack');
const utils = require('./utils');

module.exports = function (options) {
  let entry = utils.getWeexEntry(options);

  return merge(getWeexCommonConfig(options), {
    entry,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.serverIp': JSON.stringify(config.ip),
        'process.env.liveloadPort': JSON.stringify(utils.getFreePort().weexLiveLoadPort)
      })
    ]
  })
}
