
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
const fs = require('fs');
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
    'wx': `http://${config.ip}:${webServerPort}/wx/`,
    'alipay': `http://${config.ip}:${webServerPort}/alipay/`,
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
        '/components': path.resolve(cml.projectRoot, 'src/components'),
        '$PROJECT': path.resolve(root),
        '$ROUTER_CONFIG': path.resolve(root, './src/router.config.json')
      },
      modules: [
        'node_modules',
        path.join(cml.root, '/node_modules'),
      ]
    },
    resolveLoader: {
      modules: [
        path.join(cml.root, '/node_modules'),
        'node_modules'
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
          name: getstaticPath('img'),
          outputPath: function(output) {
            // 处理图片中的@符号 改成_ 解决在支付宝小程序中上传失败的问题
            output = cml.utils.handleSpecialChar(output)
            return output;
          }
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
  let devApiPrefix = `http://${config.ip}:${webServerPort}`
  // 兼容旧版api
  let apiPrefix = options.apiPrefix || devApiPrefix;
  // 新版api 优先读取domainMap
  // 浅拷贝不影响config中的domain
  let domain = {};
  if (options.domain) {
    domain = {
      ...options.domain
    }
  }


  if (options.media === 'dev') {
    // dev模式添加domainKey参数
    Object.keys(domain).forEach(key => {
      if (domain[key].toLowerCase() === 'localhost') {
        domain[key] = devApiPrefix;
      }
      domain[key] = domain[key] + '__DEV_SPLIT__' + key;
    })
  }
  // 兼容旧版api
  commonConfig.plugins.push(new webpack.DefinePlugin({
    'process.env.cmlApiPrefix': JSON.stringify(apiPrefix)
  }))
  Object.keys(domain).forEach(key => {
    commonConfig.plugins.push(new webpack.DefinePlugin({
      ['process.env.domain.' + key]: JSON.stringify(domain[key])
    }))
  })

  commonConfig.plugins.push(new webpack.DefinePlugin({
    'process.env.media': JSON.stringify(options.media)
  }))

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

  let subProject = cml.config.get().subProject;
  if (subProject && subProject.length > 0) {
    subProject.forEach(npmName => {
      let packageJSON = JSON.parse(fs.readFileSync(path.resolve(cml.projectRoot, 'node_modules', npmName, 'package.json'),{encoding:'utf-8'}));
      let cmlConfig = packageJSON.cml || {};
      let definePlugin = cmlConfig.definePlugin;
      if (definePlugin) {
        Object.keys(definePlugin).forEach(key => {
          definePlugin[key] = JSON.stringify(definePlugin[key])
        })
        commonConfig.plugins.push(new webpack.DefinePlugin(definePlugin))
      }
    })
  }


  return commonConfig;
}
