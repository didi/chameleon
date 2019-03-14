

const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { getBabelPath, getGlobalCheckWhiteList, styleLoaders, getWebEntry } = require('../utils');
var ExtractTextPlugin = require('cml-extract-css-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ChameleonWebpackPlugin = require('chameleon-webpack-plugin')
const WebpackCheckPlugin = require('webpack-check-plugin')
const getCmlLoaderConfig = require('../cml-loader.conf');
const ExportPlugin = require('./exportPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function (options) {
  let {
    type,
    media,
    root,
    disableExtract,
    mode
  } = options;

  function getstaticPath(filetype) {
    return options.hash ? `static/${filetype}/[name]_[hash:7].[ext]` : `static/${filetype}/[name].[ext]`;
  }

  function getJsPath() {
    return options.hash ? '[name]_[chunkhash].js' : '[name].js'
  }


  // 组件导出路径
  let outputPath = options.outputPath || path.resolve(root, 'dist/export/web');
  // 资源公共路径
  let publicPath;
  if (mode === 'production' && !options.publicPath) {
    throw new Error('导出生产环境模式组件必须设置publicPath')
  }
  publicPath = options.publicPath || '/';

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
      mode
    }
  },
  {
    loader: 'chameleon-loader',
    options: {
      ...getCmlLoaderConfig({ type: 'web', disableExtract }),
      cmlType: 'web',
      media,
      check: cml.config.get().check,
      postcssMixins: cml.config.get().cmss // 传递给模板编译，处理web端内置style
    }
  }
  ]

  let { entry } = getWebEntry(options);
  let commonConfig = {
    context: path.resolve(root),
    entry,
    output: {
      path: outputPath,
      publicPath,
      libraryTarget: "umd",
      filename: getJsPath()
    },
    resolve: {
      extensions: ['.cml', '.interface', '.vue', '.js'],
      alias: {
        '$ROUTER': path.resolve(root, '.temp/router.js')
      },
      modules: [
        path.join(root, '/node_modules'),
        path.join(cml.root, '/node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        path.join(root, '/node_modules'),
        path.join(cml.root, '/node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(\.min\.js)/,
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
              cmlType: type
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
        ...styleLoaders({ type: 'web', extract: false, media }),
        {
          test: /\.cml$/,
          use: cmlLoaders
        },
        {
          test: /\.vue$/,
          use: [{
            loader: 'cml-vue-loader',
            options: Object.assign(getCmlLoaderConfig({ type: 'web', disableExtract }), {
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
    plugins: [
      new webpack.DefinePlugin({
        'process.env.platform': JSON.stringify(type)
      }),
      new ExportPlugin({exportType: 'web', mode}),
      new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false})
    ]
  }

  if (cml.config.get().enableGlobalCheck === true) {
    commonConfig.plugins.push(
      new WebpackCheckPlugin({
        cmlType: type,
        whiteListFile: getGlobalCheckWhiteList()
      })
    )
  }

  if (options.definePlugin) {
    commonConfig.plugins.push(new webpack.DefinePlugin(options.definePlugin))
  }
  if (options.analysis) {
    commonConfig.plugins.push(new BundleAnalyzerPlugin())
  }

  if (options.minimize) {
    commonConfig.plugins = commonConfig.plugins.concat([
      new OptimizeCSSPlugin({
        assetNameRegExp: /\.css$/,
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }
      }),
      new UglifyJsPlugin({})
    ])
  }

  let moduleIdType = options.moduleIdType
  let moduleIdMap = {
    hash: new webpack.HashedModuleIdsPlugin(),
    name: new webpack.NamedModulesPlugin(),
    chameleon: new ChameleonWebpackPlugin({ openModuleHash: true, openChunkHash: true })
  }

  if (moduleIdType && moduleIdMap[moduleIdType]) {
    commonConfig.plugins.push(moduleIdMap[moduleIdType])
  }

  if (disableExtract !== true || mode !== 'production') {
    commonConfig.plugins.push(
      new ExtractTextPlugin({
        filename: options.hash ? 'static/css/[name]_[contenthash].css' : 'static/css/[name].css',
        allChunks: true
      })
    )
  }

  return commonConfig;
}
