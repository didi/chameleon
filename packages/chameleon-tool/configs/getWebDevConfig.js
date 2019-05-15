var getWebCommonConfig = require('./getWebCommonConfig.js');

var merge = require('webpack-merge');
var path = require('path');
var webpack = require('webpack');
var utils = require('./utils.js');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = function (options) {
  // add hot-reload related code to entry chunks
  let baseWebpackConfig = getWebCommonConfig(options);
  let devConfig = {};
  let outputPath = utils.getDevServerPath();
  if (cml.config.get().templateType === 'smarty') {
    devConfig = {
      output: {
        path: outputPath
      },
      plugins: [
        new CopyWebpackPlugin([
          {
            from: 'mock/template/',
            to: 'test'
          }
        ], {}),
        new CleanWebpackPlugin(['test', 'template', 'static', 'templates_c', '*.json', '*.js'], {root: outputPath, verbose: false})
      ]
    }

    if (cml.utils.isFile(path.join(cml.projectRoot, 'src/router.config.json'))) {
      devConfig.plugins.push(
        new CopyWebpackPlugin([
          {
            from: 'src/router.config.json',
            to: 'json'
          }
        ], {})
      )
    } else {
      cml.log.debug('项目未配置router.config.json')
      devConfig.plugins.push(
        new CleanWebpackPlugin(['json/router.config.json'], {root: outputPath, verbose: false}),
      )
    }
  } else {
    devConfig = {
      output: {
        path: outputPath
      },
      plugins: [
        new CleanWebpackPlugin(['static', '*.json', '*.js'], {root: outputPath, verbose: false})
      ]
    }
  }

  if (options.hot === true) {
    Object.keys(baseWebpackConfig.entry).forEach(function (name) {
      baseWebpackConfig.entry[name] = [path.resolve(__dirname, '../commanders/web/dev-client.js')].concat(baseWebpackConfig.entry[name])
    })
    devConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  } else {
    Object.keys(baseWebpackConfig.entry).forEach(function (name) {
      baseWebpackConfig.entry[name] = [path.resolve(__dirname, '../commanders/web/liveload-dev-client.js')].concat(baseWebpackConfig.entry[name])
    })
  }
  devConfig.mode = 'development';

  return merge(baseWebpackConfig, devConfig)
}
