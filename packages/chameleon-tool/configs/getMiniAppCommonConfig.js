var ExtractTextPlugin = require('extract-text-webpack-plugin')
var utils = require('./utils.js');
var path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
var webpack = require('webpack')
var merge = require('webpack-merge')
const getCommonConfig = require('./getCommonConfig');
module.exports = function (options) {
  let {
    type,
    media,
    root
  } = options;

  var cmlLoaderConfig = require('./cml-loader.conf')({type});

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

  const targetObj = miniMap[type];


  var outputPath = path.resolve(root, `dist/${type}`);
  var cmlLoaders = [

    {
      loader: 'chameleon-loader',
      options: { ...cmlLoaderConfig,
        cmlType: type,
        media,
        check: cml.config.get().check,
        postcss: {
          config: {
            path: path.join(cml.root, `./configs/postcss/${type}/.postcssrc.js`)
          }
        },
        isInjectBaseStyle: cml.config.get().baseStyle[type] === true
      }
    }];

  var commonConfig =
  {
    context: path.resolve(root),
    entry: utils.getMiniAppEntryFunc(type),
    target: require('chameleon-miniapp-target'),
    output: {
      path: outputPath,
      filename: 'static/js/[name].js'
    },

    module: {
      rules: [
        ...utils.styleLoaders({type: type, extract: true, media}),
        {
          test: /\.cml$/,
          use: cmlLoaders
        },
        {
          test: targetObj.templateReg,
          use: cmlLoaders
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: `[name].${targetObj.css}`,
        allChunks: true
      }),
      new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false}),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['common', 'manifest'],
        filename: 'static/js/[name].js',
        minChunks: 2
      })
    ]

  }

  if (media === 'export') {
    // 组件导出，修改jsonpFunction
    commonConfig.output.jsonpFunction = getJsonpFunction(root);
  }

  return merge(getCommonConfig(options), commonConfig);

}

function getJsonpFunction(root) {
  let roots = root.split('/');
  let projectName = roots[roots.length - 1];
  // 保证key可用
  projectName = projectName.match(/\w+/g).join('_');
  return projectName + '_' + Date.now();
}


