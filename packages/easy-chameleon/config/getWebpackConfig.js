
const {getPostcssrcPath, getCmlLoaderConfig, getMiniappEntry, styleLoaders, getJsLoader, getBabelPath} = require('./utils');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

/**
 * options.context   项目根目录
 * options.cmlType   端类型 wx web weex
 * options.media  dev 模式 会开启接口和组件运行时校验  其他值不会
 * options.hot    是否开启vue的模块热更新 只在web生效   会禁用 extract-text-webpack-plugin 
 * options.disableExtract  是否禁用 extract-text-webpack-plugin  默认是开启
 * options.cmss  cmss的配置
 */
exports.getConfig = function(options = {}) {
  defaultCmss = {
    rem: true,
    scale: 0.5,
    remOptions: {
      // base on 750px standard.
      rootValue: {cpx: 75}, // cpx转rem px不处理
      // to leave 1px alone.
      minPixelValue: null
    },
    autoprefixOptions: {
      browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
    }
  }
  let {cmlType, media, hot = false, disableExtract = false, context, cmss = defaultCmss, wxConfg = {}} = options;
  global.__CML__ = {};
  global.__CML__.cmss = cmss;

  if(!cmlType){
    throw new Error('未传递cmlType');
  }
  if(!media){ 
    throw new Error('未传递media');
  }

  function resolve (dir) {
    return path.join(context,  dir)
  }
  // 基本配置
  let webpackConfig = {
    resolve: {
      extensions: ['.cml','.interface'], //开启后缀
      modules: [
        'node_modules',
        path.join(context, '/node_modules/easy-chameleon/node_modules')
      ],
      alias: {
      },
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.join(context, '/node_modules/easy-chameleon/node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            getJsLoader()
          ],          
          include: getBabelPath(context)
        },
        {
          test: /\.interface$/,  //interface 文件会先经过interface-loader处理后就成为普通js文件
          use: [getJsLoader(),
          {
            loader: 'interface-loader',
            options: {
              cmlType: cmlType,
              media
            }
          }
          ]
        },
        {
          test: /\.cml$/,
          use: getCmlLoaders(options)
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.platform': JSON.stringify(cmlType)
      }),
    ]
  }

  // 小程序webpack配置
  if(~['wx','alipay','baidu'].indexOf(cmlType)) {

    const miniMap = {
      wx: {
        css: 'wxss',
        templateReg: /.wxml/
      },
      alipay: {
        css: 'acss',
        templateReg: /.axml/
      },
      baidu: {
        css: 'css',
        templateReg: /.swan/
      }
    }

    const targetObj = miniMap[cmlType];

  

    function getstaticPath(filetype) {
      return `static/${filetype}/[name]_[hash:7].[ext]`
    }

    // publicPath 静态资源的相对路径  都是../../static
    let {entry = [], jsonpName = 'global', outputPath = path.join(context,`dist/${cmlType}`), publicPath = '../../'} = wxConfg;
    webpackConfig = merge(webpackConfig, {
      entry: function() {
        return getMiniappEntry(context, entry, cmlType)
      },
      target: require('chameleon-miniapp-target'),
      output: {
        path: outputPath,
        publicPath,
        filename: 'static/js/[name].js'
      },
      
      resolve: {
        extensions: ['.js'], //开启后缀
      },
      module: {
        rules: [
          ...styleLoaders({type: cmlType}),
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'chameleon-url-loader',
            options: {
              limit: false,//不做limit的base64转换，需要添加?inline参数
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
            test: targetObj.templateReg,
            use: getCmlLoaders(options)
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: `[name].${targetObj.css}`,
          allChunks: true
        }),
        new CleanWebpackPlugin(['./*'], {root: outputPath}),
        new webpack.optimize.CommonsChunkPlugin({
          name: ['common','manifest'], 
          filename: 'static/js/[name].js',
          minChunks: 2
        })
      ]
    })

  }

  return webpackConfig;

}

//获取cml文件的配置
function getCmlLoaders(options) {
 

  let {cmlType, media, hot = false, disableExtract = false } = options;
  let loaders = [];
  let cmlLoaderConfig = getCmlLoaderConfig({type: cmlType,media, hot });
  let cmlLoader = {
    loader: 'chameleon-loader',
    options: { 
      ...cmlLoaderConfig,
      cmlType,
      media,
      postcss: {
        config: {
          path: getPostcssrcPath(cmlType)
        }
      },
      cmss: global.__CML__.cmss
    }
  };
  switch(cmlType) {
    case 'wx':
    case 'baidu':
    case 'alipay':
      loaders = cmlLoader;
      break;
    case 'web':
      loaders = [{
          loader: 'vue-loader',
          options: Object.assign(cmlLoaderConfig,{
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
        cmlLoader
      ]    
      break;
    case 'weex':
      loaders = [{
        loader: 'chameleon-weex-vue-loader',
        options: {
          ...cmlLoaderConfig,
          esModule: true
        }
      },
      cmlLoader
      ]    
      break;
  }

  return loaders;
} 
