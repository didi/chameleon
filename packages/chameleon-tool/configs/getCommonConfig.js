
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {getBabelPath, getExcludeBabelPath, getGlobalCheckWhiteList, getFreePort} = require('./utils');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ChameleonWebpackPlugin = require('chameleon-webpack-plugin')
const WebpackCheckPlugin = require('webpack-check-plugin')
const config = require('./config.js');
const ChameleonErrorsWebpackPlugin = require('chameleon-errors-webpack-plugin');

module.exports = function (options) {
  let {
    type,
    media,
    root
  } = options;

  function getstaticPath(filetype) {
    return `static/${filetype}/[name]_[hash:7].[ext]`
  }

  let webServerPort = getFreePort().webServerPort;

  let publicPath;
  let defaultPublichPathMap = {
    'wx': '/',
    'alipay': '/',
    'baidu': `http://${config.ip}:${webServerPort}/baidu/`, // baidu小程序的publicPath不能设置能/  所以在启动dev服务的时候 也将dist作为静态资源
    'web': `http://${config.ip}:${webServerPort}/`,
    'weex': `http://${config.ip}:${webServerPort}/weex/`
  }

  publicPath = options.publicPath || defaultPublichPathMap[type];


  let commonConfig = {
    stats: cml.logLevel === 'debug' ? 'verbose' : 'none',
    output: {
      publicPath: publicPath
    },
    resolve: {
      symlinks: false,
      extensions: ['.cml', '.interface', '.vue', '.js'],
      alias: {
        '$CMLPROJECT': path.resolve(cml.root),
        '$PROJECT': path.resolve(root),
        '$ROUTER': path.resolve(root, 'node_modules/chameleon-runtime/.temp/router.js'),
        '$ROUTER_CONFIG': path.resolve(root, './src/router.config.json')
      },
      modules: [
        'node_modules',
        path.join(cml.root, '/node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.join(cml.root, '/node_modules')
      ]
    },
    module: {
      rules: [{
        test: path.resolve(root, 'node_modules/chameleon-runtime/.temp/router.js'),
        loader: path.join(__dirname, 'routerLoader.js')
      },
      {
        test: /\.js$/,
        exclude: getExcludeBabelPath(),
        // 不能babel babel-runtime
        include: getBabelPath(),
        use: [{
          loader: 'babel-loader',
          options: {
            'filename': path.join(cml.root, 'chameleon.js')
          }
        }

        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'chameleon-url-loader',
        options: {
          limit: false, // 不做limit的base64转换，需要添加?inline参数
          name: getstaticPath('img')
        }
      }, {
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
            'filename': path.join(cml.root, 'chameleon.js')
          }
        },

        {
          loader: 'interface-loader',
          options: {
            cmlType: type,
            media,
            check: cml.config.get().check
          }
        }
        ]
      }
      ]

    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.platform': JSON.stringify(type)
      }),
      new ChameleonErrorsWebpackPlugin({
        cmlType: type
      })
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
  let apiPrefix = options.apiPrefix;
  // 兼容原来的处理 apiPrefix
  let domainMap = cml.config.get().domainMap || {apiPrefix};
  let defaultDomainKey = cml.config.get().defaultDomainKey || 'apiPrefix';
  if (options.media === 'build') {
    commonConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.domainMap': JSON.stringify(domainMap)
    }))
    commonConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.defaultDomainKey': JSON.stringify(defaultDomainKey)
    }))
    commonConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.media': JSON.stringify(options.media)
    }))
  } else if (options.media === 'dev') {
    // 默认去web端 dev模式的port
    let devApiPrefix = `http://${config.ip}:${webServerPort}`
    Object.keys(domainMap).forEach((key) => {
      domainMap[key] = devApiPrefix;
    })
    commonConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.domainMap': JSON.stringify(domainMap)
    }))
    commonConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.defaultDomainKey': JSON.stringify(defaultDomainKey)
    }))
    commonConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.media': JSON.stringify(options.media)
    }))
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
    chameleon: new ChameleonWebpackPlugin({openModuleHash: true, openChunkHash: true})
  }
  if (moduleIdType && moduleIdMap[moduleIdType]) {
    commonConfig.plugins.push(moduleIdMap[moduleIdType])
  }

  return commonConfig;
}
