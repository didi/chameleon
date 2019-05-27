const merge = require('webpack-merge')
const path = require('path');
const getCommonConfig = require('../getCommonConfig');
const utils = require('../utils.js');
const {MvvmGraphPlugin} = require('mvvm-pack');
const resolve = require('resolve');
const originSourceLoader = {
  loader: path.join(__dirname, './originSourceLoader.js')
};

module.exports = function(options) {
  let {type, media} = options;
  let npmName = cml.config.get().extPlatform[type];
  let PlatformPlugin = require(resolve.sync(npmName, { basedir: cml.projectRoot }));
  // 用户端扩展插件
  let platformPlugin = new PlatformPlugin({
    cmlType: type,
    media
  });
  cml.extPlatformPlugin[type] = platformPlugin; // 扩展新端插件， utils中获取内置组件需要用到
  debugger
  // 扩展新端编译默认配置
  if (platformPlugin.cmlConfig) {
    cml.config.merge({
      [type]: {
        ...platformPlugin.cmlConfig
      }
    });
  }

  function getCmlLoaders() {
    let loaders = utils.cssLoaders({type, media});
    loaders.js = [
      loaders.js,
      originSourceLoader
    ]
    return loaders;
  }
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
              loaders: getCmlLoaders(),
              cmlType: type,
              media,
              check: cml.config.get().check
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
  let commonConfig = getCommonConfig(options);
  commonConfig.module.rules.forEach(item => {
    // 静态资源的处理
    if (~['chameleon-url-loader', 'file-loader'].indexOf(item.loader)) {
      item.loader = 'mvvm-file-loader';
      item.options.publicPath = commonConfig.output.publicPath
    }

    if (item.test instanceof RegExp) {
      // interface获取originSource
      if (item.test.test('name.interface')) {
        item.use.splice(1, 0, originSourceLoader)
      }

      // js获取originSource
      if (item.test.test('name.js')) {
        item.use.push(originSourceLoader)
      }
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

  if (platformPlugin.miniappExt && platformPlugin.miniappExt.rule) {
    extendConfig = merge(extendConfig, {
      module: {
        rules: [
          {
            test: platformPlugin.miniappExt.rule,
            use: [{
              loader: 'mvvm-miniapp-loader',
              options: {
                loaders: utils.cssLoaders({type, media}),
                cmlType: type,
                media,
                mapping: platformPlugin.miniappExt.mapping
              }
            }]
          }
        ]
      }
    })
  }

  return merge(commonConfig, extendConfig);
}