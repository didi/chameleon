var path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');


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
    // module:{
    //   rules:[
    //       {
    //           test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    //           loader: 'chameleon-url-loader',
    //           options: {
    //               limit: false, // 不做limit的base64转换，需要添加?inline参数
    //               publicPath: cml.config.get().weex.publicPath,
    //               outputPath:`${cml.config.get().staticPath}`,
    //               name: '[name]_[hash:7].[ext]'
    //           }
    //       }
    //   ]
    // },
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
      }),
      new ZipPlugin({
          filename: 'bundle.zip',
      })
    ]
  }
    const weexCommonConfig = getWeexCommonConfig(options);

    weexCommonConfig.module.rules.forEach((e,index) => {
        if(index === 2){
            e.options = {
                limit: false, // 不做limit的base64转换，需要添加?inline参数
                publicPath: cml.config.get().weex.publicPath,
                outputPath:`${cml.config.get().staticPath}`,
                name: '[name]_[hash:7].[ext]'
            }
        }
    })

  return merge(weexCommonConfig, buildConfig)
}
