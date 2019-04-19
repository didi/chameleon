var path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
var getWebCommonConfig = require('./getWebCommonConfig.js');
var getWebExportConfig = require('./component_export/getWebExportConfig_new');

var merge = require('webpack-merge')


module.exports = function (options) {
  if (options.media === 'export') {
    return getWebExportConfig(options);
  }
  var outputPath = path.resolve(options.root, 'dist/web');
  var buildConfig = {
    output: {
      path: outputPath
    },
    plugins: [
      new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false})
    ]
  }


  return merge(getWebCommonConfig(options), buildConfig)
}
