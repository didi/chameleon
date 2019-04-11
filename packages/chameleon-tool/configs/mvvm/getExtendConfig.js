const merge = require('webpack-merge')
const path = require('path');
const MvvmGraphPlugin = require('./mvvmGraphPlugin.js');
const getCommonConfig = require('../getCommonConfig');
const utils = require('../utils.js');

module.exports = function(options) {
  let {type, media} = options;
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
      new MvvmGraphPlugin()
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
  return merge(commonConfig, extendConfig);

}