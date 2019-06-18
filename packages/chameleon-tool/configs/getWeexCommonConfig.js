const utils = require('./utils.js');
const cmlLoaderConfig = require('./cml-loader.conf')({type: 'weex'})
const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./config')
const getCommonConfig = require('./getCommonConfig');
module.exports = function (options) {
  let {
    media,
    root
  } = options;
  let isWrapComponent = cml.config.get().web[media] && cml.config.get().web[media].isWrapComponent === true

  let entry = utils.getWeexEntry(options);
  let outputPath = path.join(utils.getDevServerPath(), 'weex');
  let cmlLoaders = [{
    loader: 'chameleon-weex-vue-loader',
    options: {
      ...cmlLoaderConfig,
      esModule: true
    }
  },

  {
    loader: 'chameleon-loader',
    options: { ...cmlLoaderConfig,
      cmlType: 'weex',
      media,
      check: cml.config.get().check,
      isInjectBaseStyle: cml.config.get().baseStyle.weex === true,
      isWrapComponent
    }
  }]
  let commonConfig =
  {
    context: path.resolve(root),
    entry,
    output: {
      path: outputPath,
      filename: options.hash ? '[name]_[chunkhash].js' : '[name].js'
    },
    resolve: {
      alias: {
        '$ROUTER': path.resolve(root, 'node_modules/chameleon-runtime/.temp/router.js')
      }
    },
    module: {
      rules: [
        ...utils.styleLoaders({type: 'weex'}),
        {
          test: /\.cml$/,
          use: cmlLoaders
        },
        {
          test: /\.vue$/,
          use: [{
            loader: 'chameleon-weex-vue-loader',
            options: cmlLoaderConfig
          }

          ]
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: '// { "framework": "Vue"} \n',
        raw: true,
        exclude: 'Vue'
      })

    ],
    node: config.nodeConfiguration

  }

  if (media === 'export') {
    commonConfig.output.libraryTarget = 'umd';
  }

  return merge(getCommonConfig(options), commonConfig);


}


