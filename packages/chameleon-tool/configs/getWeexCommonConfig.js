const utils = require('./utils.js');
const cmlLoaderConfig = require('./cml-loader.conf')({type: 'weex'})
const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('./config')
const cmlUtils = require('chameleon-tool-utils');
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
    name: 'weex',
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
  return merge(getCommonConfig(options), commonConfig);


}


