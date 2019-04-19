

var getMiniAppCommonConfig = require('../getMiniAppCommonConfig.js');
var merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin')
var path = require('path');

module.exports = function (options) {
  let { type, root } = options;
  let outputPath = options.outputPath || path.resolve(root, `dist/export/${type}`);
  return merge(getMiniAppCommonConfig(options), {
    output: {
      path: outputPath
    },
    plugins: [
      new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false})
    ]
  })
}
