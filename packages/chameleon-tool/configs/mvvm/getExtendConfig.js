const merge = require('webpack-merge')
const path = require('path');
const getCommonConfig = require('../getCommonConfig');
const utils = require('../utils.js');
const {MvvmGraphPlugin} = require('mvvm-pack');
const resolve = require('resolve');


module.exports = function(options) {
  let {type, media} = options;
  let npmName = cml.config.get().extPlatform[type];
  // let PlatformPlugin = require(path.join(cml.projectRoot, 'node_modules', npmName)); // eslint-disable-line
  let PlatformPlugin = require(resolve.sync(npmName, { basedir: cml.projectRoot }));
  // 用户端扩展插件
  let platformPlugin = new PlatformPlugin({
    cmlType: type,
    media
  });
  let extendConfig = {
    entry: {
      app: path.join(cml.projectRoot, 'src/app/app.cml')
    },
    output: {
      path: path.join(cml.projectRoot, 'dist/' + type)
    },
    module: {
      rules: [
        ...utils.styleLoaders({type}),
        {
          test: /\.cml$/,
          use: [{
            loader: 'mvvm-cml-loader',
            options: {
              loaders: utils.cssLoaders({type, media}),
              cmlType: type,
              media,
              check: cml.config.get().check,
            }
          }]
        }
      ]
    },
    plugins: [
      new MvvmGraphPlugin({
        cmlType: type,
        media
      }, platformPlugin)
    ]
  };
  // options.moduleIdType = 'hash';
  let commonConfig = getCommonConfig(options);
  commonConfig.module.rules.forEach(item => {
    if (~['chameleon-url-loader', 'file-loader'].indexOf(item.loader)) {
      item.loader = 'mvvm-file-loader';
      item.options.publicPath = commonConfig.output.publicPath
    }
  })

  // 用户可以扩展webpack的rules用于处理特有文件后缀
  if (platformPlugin.webpackRules && platformPlugin.webpackRules instanceof Array) {
    extendConfig = merge(extendConfig, {
      module: {
        rules: platformPlugin.webpackRules
      }
    })
  }

  return merge(commonConfig, extendConfig);

}