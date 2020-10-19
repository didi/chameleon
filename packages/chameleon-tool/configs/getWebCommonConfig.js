var ExtractTextPlugin = require('cml-extract-css-webpack-plugin')
var utils = require('./utils.js');
var getCmlLoaderConfig = require('./cml-loader.conf');
var path = require('path');
var webpack = require('webpack')
var merge = require('webpack-merge')
const getCommonConfig = require('./getCommonConfig');
const cmlUtils = require('chameleon-tool-utils');
module.exports = function (options) {
  let {
    media,
    root,
    disableExtract,
    hot
  } = options;

  let isWrapComponent = cml.config.get().web[media] && cml.config.get().web[media].isWrapComponent === true

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
      },
      compilerModules: [
        {
          postTransformNode: el => {
            require('chameleon-vue-precompiler')()(el)
          }
        }
      ]
    })

  },

  {
    loader: 'chameleon-loader',
    options: { ...getCmlLoaderConfig({type: 'web', disableExtract}),
      cmlType: 'web',
      media,
      check: cml.config.get().check,
      cmss: cml.config.get().cmss, // 传递给模板编译，处理web端内置style
      isInjectBaseStyle: cml.config.get().baseStyle.web === true,
      isWrapComponent,
      subProject: cml.config.get().subProject
    }
  }
  ]
  var commonConfig =
  {
    name: 'web',
    context: path.resolve(root),
    entry,
    output: {
      filename: getJsPath(),
      chunkFilename: getJsPath()
    },
    resolve: {
      alias: {
        '$ROUTER': path.resolve(root, 'node_modules/chameleon-runtime/.temp/router.js')
      }
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
              },
              compilerModules: [
                {
                  postTransformNode: el => {
                    require('chameleon-vue-precompiler')()(el)
                  }
                }
              ]
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
        name: ['vender', 'manifest'],
        filename: getJsPath(),
        minChunks: 2
      }),
      ...htmlPlugins
    ])
  }
  const {routerConfig} = cmlUtils.getRouterConfig();
  let mpa = routerConfig.mpa;
  if (mpa && mpa.weexMpa && Array.isArray(mpa.weexMpa)) { // 配置了weex多页面
    commonConfig.module.rules.push(
      {
        test: path.resolve(cml.projectRoot, 'node_modules/chameleon-runtime/.temp/entry.js'),
        loader: path.join(__dirname, 'entryLoader.js')
      }
    )
  }
  if (options.cache) {
    utils.addCahceLoader(commonConfig, 'web');
  }
  return merge(getCommonConfig(options), commonConfig);

}

