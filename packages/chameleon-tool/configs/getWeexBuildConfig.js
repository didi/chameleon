var path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')


var getWeexCommonConfig = require('./getWeexCommonConfig.js');
var getWeexExportConfig = require('./component_export/getWeexExportConfig_new');
var utils = require('./utils.js');


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
          config.buildInfo = config.buildInfo || {};
          let {wxAppId} = config.buildInfo
          let weexjs = assets[config.projectName].js;
          let {routerConfig, hasError} = cml.utils.getRouterConfig();
          if (hasError) {
            throw new Error('router.config.json格式不正确')
          }

          if (routerConfig) {
            let result = [];
            if (!routerConfig.domain) {
              throw new Error('router.config.json 中未设置web端需要的domain字段');
            }
            let {domain, mode} = routerConfig;

            routerConfig.routes.forEach(item => {
              let webUrl = domain;
              if (mode === 'history') {
                webUrl += item.url;
              } else if (mode === 'hash') {
                webUrl += ('#' + item.url);
              }
              let route = {
                wx: {
                  appId: wxAppId,
                  path: item.path
                },
                web: {
                  url: webUrl
                },
                weex: {
                  url: weexjs,
                  query: {
                    path: item.path
                  }
                }
              }
              if (item.extra) {
                route.extra = item.extra;
              }
              result.push(route);
            })
            return JSON.stringify(result, '', 4);
          }

        }
      })
    ]
  }


  return merge(getWeexCommonConfig(options), buildConfig)
}
