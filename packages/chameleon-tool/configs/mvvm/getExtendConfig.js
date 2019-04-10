const merge = require('webpack-merge')
const path = require('path');
// const cmlLoader = path.join(__dirname, './extCmlLoader.js');
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
      {
        apply(compiler) {
          compiler.plugin('should-emit', function(compilation) {
            debugger
          })

        }
      }
    ]
  };
  return merge(getCommonConfig(options), extendConfig);

}