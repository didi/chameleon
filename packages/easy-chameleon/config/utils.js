const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const cmlUtils = require('chameleon-tool-utils');


exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: options.minimize,
      sourceMap: false
    }
  }

  function getPostCssLoader(type) {
    return {
      loader: 'postcss-loader',
      options: {
        sourceMap: false,
        config: {
          path: exports.getPostcssrcPath(type)
        }
      }
    }
  }

  function getMiniappLoader(type) {
    // 把chameleon-css-loader需要在postcssloader之后处理，postcssloader先处理@import，否则@import文件中的内容不经过chameleon-css-loader
    // chameleon-css-loader需要再最后处理，需要标准的css格式
    return [
      {
        loader: 'chameleon-css-loader',
        options: {
          platform: 'miniapp'
        }
      },
      getPostCssLoader(type)
    ]
  }

  function addMediaLoader(loaders, type) {
    loaders.push({
      loader: 'chameleon-css-loader',
      options: {
        media: true,
        cmlType: type
      }
    })
    return loaders
  }


  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    var loaders = [cssLoader];
    let result = [];

    if (options.type === 'web') {
      // 把chameleon-css-loader需要在postcssloader之后处理，postcssloader先处理@import，否则@import文件中的内容不经过chameleon-css-loader
      // chameleon-css-loader需要再最后处理，需要标准的css格式
      loaders.push({
        loader: 'chameleon-css-loader',
        options: {
          platform: 'web',
          ...global.__CML__.cmss
        }
      })
      loaders.push(getPostCssLoader('web'))
    }
    if (~['wx', 'alipay', 'baidu'].indexOf(options.type)) {
      loaders = loaders.concat(getMiniappLoader(options.type))
    }

    if (options.type === 'weex') {
      // 把wchameleon-css-loader需要在postcssloader之后处理，postcssloader先处理@import，否则@import文件中的内容不经过chameleon-css-loader
      // weex不能使用css-loader css-loader就开始添加module.exports模块化代码，而weex-vue-loader中内部会处理css字符串为对象
      loaders = [
        {
          loader: 'chameleon-css-loader',
          options: {
            platform: 'weex'
          }
        },
        getPostCssLoader('weex')
      ];
    }
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: false
        })
      })
    }

    if (options.media === 'export' && options.type !== 'wx' && options.mode !== 'production') {
      loaders.push(getPostCssLoader('export'));
    }

    if (options.type === 'weex') {
      result = loaders;
    } else {
      if (options.extract) {
        result = ExtractTextPlugin.extract({
          use: loaders,
          fallback: 'vue-style-loader'
        })
      } else {
        result = ['vue-style-loader'].concat(loaders)
      }
    }

    addMediaLoader(result, options.type);
    return result;
  }
  var result = {
    css: generateLoaders('less'),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    // sass: generateLoaders('sass', { indentedSyntax: true }),
    // scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
    js: exports.getJsLoader() // 处理vue-loader weex-vue-loader chameleon-loader中的js
  }
  return result;
}

exports.getJsLoader = function () {
  return {
    loader: 'babel-loader',
    options: {
      filename: path.join(__dirname, '../.babelrc')
    }
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  delete loaders.js;
  for (var extension in loaders) {
    if (loaders.hasOwnProperty(extension)) {
      var loader = loaders[extension]
      if (extension === 'css') {
        output.push({
          test: new RegExp('\\.' + extension + '$'),
          exclude: new RegExp('min\\.' + extension + '$'),
          use: loader
        })
        let minLoader = loader;
        // min.css 为后缀的css不过postcss-loader
        minLoader.splice(minLoader.indexOf(webpostcssLoader), 1);
        output.push({
          test: new RegExp('min\\.' + extension + '$'),
          use: minLoader
        })
      } else {
        output.push({
          test: new RegExp('\\.' + extension + '$'),
          use: loader
        })
      }
    }

  }
  return output
}


//以上三个方法与chameleon-cli保持一致



exports.getCmlLoaderConfig = function ({type, hot, disableExtract}){ 
  let extract = hot !== true && disableExtract !== true;
  return {
    loaders: exports.cssLoaders({
      extract,
      type
    })
  }
}



exports.getPostcssrcPath = function (type) {
  return path.join(__dirname, `../postcss/${type}/.postcssrc.js`);
}


exports.getMiniappEntry = function(context, entryList = [], cmlType) {
  var root = context;
  var entry = {};
  entry['common'] = ['chameleon-runtime/index.js','chameleon-store/index.js']
  var projectPath = path.resolve(root,'src');
  var npmPath = path.resolve(root,'node_modules');
  
  //记录已经添加的入口，防止重复循环添加
  let hasEntryedPath = [];

  //组件导出
  let exportEntryFile = cmlUtils.getExportEntry(cmlType, context, entryList );
  exportEntryFile.forEach(item=>{
    addEntry(item);
  })

  let npmComponents = cmlUtils.getNpmComponents(cmlType, root);
  let buildInComponens = cmlUtils.getBuildinComponents(cmlType, root).components;
  npmComponents = npmComponents.concat(buildInComponens);
  npmComponents.forEach(item=>{
    addEntry(item.filePath)
  })
 
  return entry;

  function addEntry(chameleonFilePath){
    //plugin://
    if(!chameleonFilePath) {
      return;
    }
    if(~hasEntryedPath.indexOf(chameleonFilePath)) {
      return;
    }
    hasEntryedPath.push(chameleonFilePath);
    let entryName = cmlUtils.getPureEntryName(chameleonFilePath, cmlType, root);
    entry[entryName] = chameleonFilePath;

    //处理json文件中引用的组件作为入口,wxml文件
    let targetObject = cmlUtils.getJsonFileContent(chameleonFilePath, cmlType)
    if(targetObject && targetObject.usingComponents) {
      let usingComponents = targetObject.usingComponents;
      Object.keys(usingComponents).forEach(key=>{
        let comPath = usingComponents[key];
        let {filePath} = cmlUtils.handleComponentUrl(root,chameleonFilePath,comPath,cmlType);
        addEntry(filePath);
      })
    }
  }
}



let babelNpm = [
  "chameleon-ui-builtin",
  'cml-ui',
  'chameleon-runtime',
  'chameleon-store',
  'chameleon-bridge',
  'chameleon-api',
  'chameleon-tool-utils',
  'chameleon-css-loader',
  'chameleon-loader',
  'chameleon-miniapp-target',
  'chameleon-mixins',
  'chameleon-template-parse',
  'chameleon-templates',
  'chameleon-vue-precompiler',
  'chameleon-webpack-plugin',
  'chameleon-dev-proxy',
  'chameleon-linter',
  'interface-loader',
  'chameleon-url-loader',
  'webpack-check-plugin',
  'chameleon-webpack-dev-middleware',
  'webpack-liveload-middleware',
  'chameleon-weex-vue-loader',
  'babel-plugin-chameleon-import'
];

exports.getBabelPath = function (context) {

  let babelPath = [
  ]
  babelNpm.forEach(item => {
    babelPath.push(path.join(context, 'node_modules', item))
    babelPath.push(path.join(context, 'node_modules/easy-chameleon/node_modules', item))
  })
  return babelPath
}