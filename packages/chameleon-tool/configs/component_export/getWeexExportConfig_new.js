
const merge = require('webpack-merge');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const getWeexCommonConfig = require('../getWeexCommonConfig');
const { styleLoaders, getBabelPath } = require('../utils');
const getCmlLoaderConfig = require('../cml-loader.conf');
const ExportPlugin = require('./exportPlugin');

module.exports = function(options) {
  let {
    media,
    root,
    mode = 'production',
    externals
  } = options;


  function getstaticPath(filetype) {
    return `static/${filetype}/[name]_[hash:7].[ext]`;
  }

  function getJsPath() {
    return options.hash ? '[name]_[chunkhash].js' : '[name].js'
  }

  // 组件导出路径
  let outputPath = options.outputPath || path.resolve(root, 'dist/export/weex');
  // 资源公共路径
  let publicPath = options.publicPath || '/';

  let cmlLoaderConfig = getCmlLoaderConfig({type: 'weex', media, mode });

  let cmlLoaders = [{
    loader: 'chameleon-weex-vue-loader',
    options: {
      ...cmlLoaderConfig,
      esModule: true
    }
  },
  {
    loader: path.resolve(__dirname, './export-loader.js'),
    options: {
      mode,
      platform: 'weex'
    }
  },
  {
    loader: 'chameleon-loader',
    options: { ...cmlLoaderConfig,
      cmlType: 'weex',
      media,
      check: cml.config.get().check
    }
  }]

  const exportConfig = {
    output: {
      path: outputPath,
      publicPath,
      libraryTarget: "umd",
      filename: getJsPath()
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(\.min\.js)/,
          // 不能babel babel-runtime
          include: getBabelPath(),
          use: [{
            loader: 'babel-loader',
            options: {
              'filename': path.join(cml.root, 'package.json')
            }
          },
          {
            loader: path.resolve(__dirname, './export-loader.js'),
            options: {
              mode
            }
          }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            {
              loader: 'chameleon-url-loader',
              options: {
                name: getstaticPath('img'),
                fallback: mode === 'production' ? undefined :path.resolve(__dirname, './export-loader.js'),
                fileType: 'assets',
                mode
              }
            }
          ]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: getstaticPath('media'),
            useRelativePath: mode === 'production' ? false : true,
            outputPath: function(url) {
              return mode === 'production' ? url : url + '?__export';
            }
          }
        },
        {
          test: /\.(woff|woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: getstaticPath('fonts'),
            useRelativePath: mode === 'production' ? false : true,
            outputPath: function(url) {
              return mode === 'production' ? url : url + '?__export';
            }
          }
        },
        {
          test: /\.interface$/,
          // 不能babel babel-runtime
          include: getBabelPath(),
          use: [{
            loader: 'babel-loader',
            options: {
              'filename': path.join(cml.root, 'package.json')
            }
          },
          {
            loader: 'interface-loader',
            options: {
              cmlType: 'weex'
            }
          },
          {
            loader: path.resolve(__dirname, './export-loader.js'),
            options: {
              mode
            }
          }]
        },
        ...styleLoaders({ type: 'weex', extract: false, media }),
        {
          test: /\.cml$/,
          use: cmlLoaders
        }
      ]
    },
    plugins: [
      new ExportPlugin({exportType: 'weex', mode}),
      new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false})
    ]
  }

  if (externals) {
    exportConfig.externals = externals;
  }

  return merge.smart(getWeexCommonConfig(options), exportConfig)
}
