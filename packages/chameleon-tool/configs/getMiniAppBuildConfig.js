var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var getMiniAppCommonConfig = require('./getMiniAppCommonConfig.js');
var merge = require('webpack-merge')
var getMiniAppExportConfig = require("./component_export/getMiniAppExportConfig");

module.exports = function (options) {
  let {type, media} = options;
  if (media === 'export') {
    return getMiniAppExportConfig(options);
  }
  var commonConfig = getMiniAppCommonConfig(options);
  var buildConfig = {
    plugins: [
      new webpack.HashedModuleIdsPlugin()
    ]
  }
  const miniMap = {
    wx: {
      cssReg: /(\.wxss|\.css)$/
    },
    alipay: {
      cssReg: /(\.acss|\.css)$/
    },
    baidu: {
      cssReg: /\.css$/
    }
  }
  const targetObj = miniMap[type];
  if (options.minimize) {
    buildConfig.plugins = [
      new OptimizeCSSPlugin({
        assetNameRegExp: targetObj.cssReg,
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }
      }),
      new UglifyJsPlugin({})
    ]
  }
  return merge(commonConfig, buildConfig)
}
