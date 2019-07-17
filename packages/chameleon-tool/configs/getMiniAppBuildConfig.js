var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var webpack = require('webpack');
var getMiniAppCommonConfig = require('./getMiniAppCommonConfig.js');
var merge = require('webpack-merge')
var getMiniAppExportConfig = require("./component_export/getMiniAppExportConfig");

module.exports = function (options) {
  let {type, media} = options;
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
    },
    qq: {
      cssReg: /(\.qss|\.css)$/
    }
  }
  const targetObj = miniMap[type];
  if (options.minimize) {
    buildConfig.plugins = [
      new OptimizeCSSPlugin({
        assetNameRegExp: targetObj.cssReg,
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true }, autoprefixer: false }
      })
    ]
  }
  if (media === 'export') {
    return getMiniAppExportConfig(merge(commonConfig, buildConfig), options);
  }
  return merge(commonConfig, buildConfig)
}
