/* eslint-disable */
var ExtractTextPlugin = require('cml-extract-css-webpack-plugin')
var utils = require('./utils.js');
var path = require('path');
var webpack = require('webpack')
var merge = require('webpack-merge')
const getCommonConfig = require('./getCommonConfig');
const CopyNpmPlugin = require('./plugins/CopyNpmPLugin.js');
const miniAppSubPkg = require('./plugins/miniAppSubPkg.js');
const miniAppBaseCssAdd = require('./plugins/miniAppBaseCssAdd.js');

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
    },
    qq: {
      css: 'qss',
      templateReg: /.qml/
    },
    tt: {
      css: 'ttss',
      templateReg: /.ttml/
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
        isInjectBaseStyle: cml.config.get().baseStyle[type] === true,
        subProject: cml.config.get().subProject
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
      new webpack.optimize.CommonsChunkPlugin({
        name: ['common', 'manifest'],
        filename: 'static/js/[name].js',
        minChunks: 2
      }),
      new CopyNpmPlugin({
        cmlType: type,
        root: outputPath
      }),
      // eslint-disable-next-line new-cap
      new miniAppSubPkg({
        cmlType: type
      }),
      // eslint-disable-next-line new-cap
      new miniAppBaseCssAdd({
        cmlType: type,
        isInjectBaseStyle: cml.config.get().baseStyle[type] === true
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


