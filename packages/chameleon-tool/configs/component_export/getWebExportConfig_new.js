
const merge = require('webpack-merge')
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const getWebCommonConfig = require('../getWebCommonConfig.js')
const getCmlLoaderConfig = require('../cml-loader.conf');
const { styleLoaders, getBabelPath } = require('../utils');
const ExportPlugin = require('./exportPlugin');
const ExtractTextPlugin = require('cml-extract-css-webpack-plugin')


module.exports = function(options) {
  let {
    media,
    root,
    disableExtract,
    mode = 'production'
  } = options;

  function getstaticPath(filetype) {
    return `static/${filetype}/[name]_[hash:7].[ext]`;
  }

  function getJsPath() {
    return options.hash ? '[name]_[chunkhash].js' : '[name].js'
  }

  // 组件导出路径
  let outputPath = options.outputPath || path.resolve(root, 'dist/export/web');
  // 资源公共路径
  let publicPath = options.publicPath || '/';

  var cmlLoaders = [{
    loader: 'cml-vue-loader',
    options: Object.assign(getCmlLoaderConfig({ type: 'web', disableExtract, media, mode }), {
      postcss: {
        config: {
          path: path.join(cml.root, './configs/postcss/web/.postcssrc.js')
        }
      },
      compilerModules: [
        {
          postTransformNode: el => {
            // to convert vnode for weex components.
            require('chameleon-vue-precompiler')()(el)
          }
        }
      ]
    })
  },
  {
    loader: path.resolve(__dirname, './export-loader.js'),
    options: {
      mode,
      platform: 'web'
    }
  },
  {
    loader: 'chameleon-loader',
    options: {
      ...getCmlLoaderConfig({ type: 'web', disableExtract }),
      cmlType: 'web',
      media,
      check: cml.config.get().check,
      cmss: cml.config.get().cmss // 传递给模板编译，处理web端内置style
    }
  }]

  var exportConfig = {
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
                fallback: mode === 'production' ? undefined : path.resolve(__dirname, './export-loader.js'),
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
            useRelativePath: mode !== 'production',
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
            useRelativePath: mode !== 'production',
            outputPath: function(url) {
              return mode === 'production' ? url : url + '?__export';
            }
          }
        },
        {
          test: /\.interface$/,
          // exclude: /(node_modules|bower_components)/,
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
              cmlType: 'web'
            }
          },
          {
            loader: path.resolve(__dirname, './export-loader.js'),
            options: {
              mode
            }
          }]
        },
        ...styleLoaders({ type: 'web', extract: false, media }),
        {
          test: /\.cml$/,
          use: cmlLoaders
        }
      ]
    },
    plugins: [
      new ExportPlugin({exportType: 'web', mode}),
      new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false})
    ]
  }

  if (disableExtract !== true) {
    exportConfig.plugins.push(
      new ExtractTextPlugin({
        filename: options.hash ? '[name]_[contenthash].css' : '[name].css',
        allChunks: true
      })
    )
  }

  return merge.smart(getWebCommonConfig(options), exportConfig);


}
