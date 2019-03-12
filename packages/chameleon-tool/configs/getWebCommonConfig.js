var ExtractTextPlugin = require('cml-extract-css-webpack-plugin')
var utils = require('./utils.js');
var getCmlLoaderConfig = require('./cml-loader.conf');
var path = require('path');
var webpack = require('webpack')
var merge = require('webpack-merge')
const getCommonConfig = require('./getCommonConfig');

module.exports = function (options) {
  let {
    media,
    root,
    disableExtract,
    hot
  } = options;


  function getJsPath() {
    return options.hash ? 'static/js/[name]_[chunkhash].js' : 'static/js/[name].js'
  }

  let {entry, htmlPlugins} = utils.getWebEntry(options);

  var cmlLoaders = [{
    loader: 'cml-vue-loader',
    options: Object.assign(getCmlLoaderConfig({type: 'web', hot: options.hot, disableExtract}), {
      postcss: {
        config: {
          path: path.join(cml.root, './configs/postcss/web/.postcssrc.js')
        }
      }
      // compilerModules: [
      //   {
      //     postTransformNode: el => {
      //       require('chameleon-vue-precompiler')()(el)
      //     }
      //   }
      // ]
    })

  },

  {
    loader: 'chameleon-loader',
    options: { ...getCmlLoaderConfig({type: 'web', disableExtract}),
      cmlType: 'web',
      media,
      check: cml.config.get().check,
      cmss: cml.config.get().cmss, // 传递给模板编译，处理web端内置style
      isInjectBaseStyle: cml.config.get().baseStyle.web === true

    }
  }
  ]
  var commonConfig =
  {
    context: path.resolve(root),
    entry,
    output: {
      filename: getJsPath()
    },
    module: {
      rules: [
        ...utils.styleLoaders({type: 'web', extract: !hot && !disableExtract}),
        {
          test: /\.cml$/,
          use: cmlLoaders
        },

        {
          test: /\.vue$/,
          use: [{
            loader: 'cml-vue-loader',
            options: Object.assign(getCmlLoaderConfig({type: 'web', hot: options.hot, disableExtract}), {
              postcss: {
                config: {
                  path: path.join(cml.root, './configs/postcss/web/.postcssrc.js')
                }
              }
              // compilerModules: [
              //   {
              //     postTransformNode: el => {
              //       require('chameleon-vue-precompiler')()(el)
              //     }
              //   }
              // ]
            })
          }
          ]
        }
      ]
    },
    plugins: []

  }

  if (options.hot !== true && disableExtract !== true && media !== 'export') {
    commonConfig.plugins.push(
      new ExtractTextPlugin({
        filename: options.hash ? 'static/css/[name]_[contenthash].css' : 'static/css/[name].css',
        allChunks: true
      })
    )
  }

  // 非export模式
  if (cml.media !== 'export') {
    commonConfig.plugins = commonConfig.plugins.concat([
      new webpack.optimize.CommonsChunkPlugin({
        name: ['common', 'vender', 'manifest'],
        filename: getJsPath(),
        minChunks: 2
      }),
      ...htmlPlugins
    ])
  }


  return merge(getCommonConfig(options), commonConfig);

}

