

const path = require('path');
const webpack = require('webpack');
const {getBabelPath, getGlobalCheckWhiteList, styleLoaders, getWeexEntry} = require('../utils');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ChameleonWebpackPlugin = require('chameleon-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackCheckPlugin = require('webpack-check-plugin')
const ExportPlugin = require('./exportPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const getCmlLoaderConfig = require('../cml-loader.conf');

module.exports = function (options) {
  let {
    type,
    media,
    root,
    disableExtract,
    mode
  } = options;
  let cmlLoaderConfig = getCmlLoaderConfig({type: 'weex', media, mode })

  function getstaticPath(filetype) {
    return options.hash ? `static/${filetype}/[name]_[hash:7].[ext]` : `static/${filetype}/[name].[ext]`;
  }

  function getJsPath() {
    return options.hash ? '[name]_[chunkhash].js' : '[name].js'
  }

  // 组件导出路径
  let outputPath = options.outputPath || path.resolve(root, 'dist/export/weex');
  // 资源公共路径
  let publicPath;
  if (mode === 'production' && !options.publicPath) {
    throw new Error('导出生产环境模式组件必须设置publicPath')
  }
  publicPath = options.publicPath || '/';

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
      mode
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
  let commonConfig = {
    entry: getWeexEntry(options),
    context: path.resolve(root),
    output: {
      path: outputPath,
      publicPath,
      libraryTarget: "umd",
      filename: getJsPath()
    },
    resolve: {
      extensions: ['.cml', '.interface', '.vue', '.js'],
      alias: {
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
          //不能babel babel-runtime
          include: getBabelPath(),
          use: [{
            loader: 'babel-loader',
            options: {
              'filename': path.join(chameleon.root, 'package.json') 
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
          loader: 'chameleon-url-loader',
          options: {
            name: getstaticPath('img'),
            fallback: mode === 'production' ? undefined :path.resolve(__dirname, './export-loader.js'),
            fileType: 'assets',
            mode
          }
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'chameleon-url-loader',
          options: {
            name: getstaticPath('img')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: getstaticPath('media')
          }
        },
        {
          test: /\.(woff|woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: getstaticPath('fonts')
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
              name: getstaticPath('media'),
              useRelativePath: mode === 'production' ? false : true,
              outputPath: function(url) {
                return mode === 'production' ? url : url + '?__export';
              }
            }
          }]
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
          // exclude: /(node_modules|bower_components)/,
          //不能babel babel-runtime
          include: getBabelPath(),
          use: [{
            loader: 'babel-loader',
            options: {
              'filename': path.join(cml.root, 'package.json')
            }
          }]
        },
        {
          loader: path.resolve(__dirname, './export-loader.js'),
          options: {
            mode
          }
        },
        {
          loader: 'interface-loader',
          options: {
            cmlType: type,
            media
          }
        },
        ...styleLoaders({type: 'weex', extract: false, media}),
        {
          test: /\.cml$/,
          use: cmlLoaders
        },
        {
          test: /\.vue$/,
          use: [{
            loader: 'chameleon-weex-vue-loader',
            options: cmlLoaderConfig
          }]
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: '// { "framework": "Vue"} \n',
        raw: true,
        exclude: 'Vue'
      }),
      new webpack.DefinePlugin({
        'process.env.platform': JSON.stringify(type)
      }),
      new ExportPlugin({exportType: 'weex', mode}),
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
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true }, autoprefixer: false }
      }),
      new UglifyJsPlugin({})
    ])
  }

  let moduleIdType = options.moduleIdType
  let moduleIdMap = {
    hash: new webpack.HashedModuleIdsPlugin(),
    name: new webpack.NamedModulesPlugin(),
    chameleon: new ChameleonWebpackPlugin({openModuleHash: true, openChunkHash: true})
  }
  if (moduleIdType && moduleIdMap[moduleIdType]) {
    commonConfig.plugins.push(moduleIdMap[moduleIdType])
  }

  return commonConfig;
}
