var path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
var getWeexCommonConfig = require('./getWeexCommonConfig.js');
var getWeexExportConfig = require('./component_export/getWeexExportConfig_new');


var merge = require('webpack-merge')

module.exports = function (options) {
  if (options.media === 'export') {
    return getWeexExportConfig(options);
  }
  var outputPath = path.resolve(options.root, 'dist/weex');
  var buildConfig = {
    output: {
      path: outputPath
    },
    plugins: [
      new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false}),
      new AssetsPlugin({
        filename: '/dist/config.json',
        processOutput: function (assets) {
          let config = cml.config.get();

          let weexjs = assets[config.projectName].js;
          return JSON.stringify({
            weexjs
          }, '', 4);        

        }
      })
    ]
  }


  return merge(getWeexCommonConfig(options), buildConfig)
}
