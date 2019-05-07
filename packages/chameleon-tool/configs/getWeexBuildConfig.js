var path = require('path');
const utils = require('./utils.js');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
var getWeexCommonConfig = require('./getWeexCommonConfig.js');
var getWeexExportConfig = require('./component_export/getWeexExportConfig_new');
const ZipPlugin = require('zip-webpack-plugin');


var merge = require('webpack-merge')

module.exports = function (options) {
  if (options.media === 'export') {
    return getWeexExportConfig(options);
  }
  let entry = utils.getWeexEntry(options);
  var outputPath = path.resolve(options.root, 'dist/weex');

  const weexCommonConfig = getWeexCommonConfig(options);
  const configArr = []
  Object.keys(entry).forEach(key => {
    var buildConfig = {
      output: {
        path: `${outputPath}/${key}`,
        filename: '[name]_[hash:7].js'
      },
      plugins: [
        new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false}),
        new ZipPlugin({
          filename: `${key}.zip`
        })
      ]
    }
    buildConfig.entry = {};
    buildConfig.entry[key] = entry[key]
    weexCommonConfig.module.rules.forEach((e, index) => {
      if (index === 2) {
        e.options = {
          limit: false, // 不做limit的base64转换，需要添加?inline参数
          publicPath: cml.config.get().weex.publicPath,
          name: `${cml.config.get().staticPath}/[name]_[hash:7].[ext]`
        }
      }
    })
    configArr.push(merge(weexCommonConfig, buildConfig))
  })


  return configArr;
}
