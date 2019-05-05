var path = require('path')
var ExtractTextPlugin = require('cml-extract-css-webpack-plugin')
var fs = require('fs');
const fse = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin')
let webpostcssLoader = 'postcss-loader';
const portfinder = require('portfinder');
const analyzeTemplate = require('chameleon-template-parse').analyzeTemplate;
const glob = require('glob');

exports.getPostcssrcPath = function (type) {
  return path.join(__dirname, `./postcss/${type}/.postcssrc.js`);
}

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
          platform: 'miniapp',
          cmlType: type
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
          ...cml.config.get().cmss
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
      filename: path.join(cml.root, 'chameleon.js')
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
exports.updateEntry = function (updateEntryConfig) {
  try {
    let { entry, cmlType, root, addEntry } = updateEntryConfig;
    let { components, compileTagMap } = cml.utils.getBuildinComponents(cmlType, root);
    let options = { buildInComponents: compileTagMap, usedBuildInTagMap: {}};
    let source = '';
    Object.keys(entry).forEach(key => {
      if (cml.utils.isFile(entry[key])) {
        let content = fs.readFileSync(entry[key], 'utf-8');
        let parts = cml.utils.splitParts({ content });
        if (parts && parts.template.length) {
          source = parts.template[0].content;
          options = analyzeTemplate(source, options)
        }

      }
    });
    let usedBuildInTagMap = options.usedBuildInTagMap;
    // 收集用了哪些内置组件 usedBuildInTagMap:{button:'cml-buildin-button',radio:'cml-buildin-radio'}
    let usedBuildInTagValues = Object.values(usedBuildInTagMap)
    components = components.filter((component) => ~usedBuildInTagValues.indexOf(component.name));
    components.forEach(item => {
      addEntry(item.filePath)
    });
  } catch (e) {
    console.log('updateEntry', e)
  }
}
exports.getMiniAppEntryFunc = function (cmlType) {
  return function () {
    return exports.getMiniAppEntry(cmlType);
  }
}

exports.getMiniAppEntry = function (cmlType) {
  var root = cml.projectRoot;
  var entry = {};
  entry.common = [`chameleon-runtime/index.js`, `chameleon-store/index.js`]
  var projectPath = path.resolve(root, 'src');

  // 记录已经添加的入口，防止重复循环添加
  let hasEntryedPath = [];
  // 组件导出
  if (cml.media === 'export') {
    let entryList = cml.config.get()[cmlType]['export'].entry;
    let exportEntryFile = cml.utils.getExportEntry(cmlType, root, entryList);
    exportEntryFile.forEach(item => {
      addEntry(item);
    })
  } else {
    entry.app = path.join(projectPath, 'app/app.cml');
    let appjson = cml.utils.getJsonFileContent(path.resolve(cml.projectRoot, 'src/app/app.cml'), cmlType)
    appjson.pages && appjson.pages.forEach(item => {
      let cmlFilePath = path.resolve(cml.projectRoot, 'src', item + '.cml')
      addEntry(cmlFilePath)
    })

    let npmComponents = cml.utils.getNpmComponents(cmlType, root);
    if (!cml.config.get().isBuildInProject && cml.media !== 'build') {

      let buildInComponens = cml.utils.getBuildinComponents(cmlType, root).components;
      npmComponents = npmComponents.concat(buildInComponens);
    }
    npmComponents.forEach(item => {
      addEntry(item.filePath)
    })

    // cmlPages的入口
    let cmlPages = cml.config.get().cmlPages;
    if (cmlPages && cmlPages.length > 0) {
      cmlPages.forEach(function(npmName) {
        let npmRouterConfig = JSON.parse(fs.readFileSync(path.join(cml.projectRoot, 'node_modules', npmName, 'src/router.config.json'), {encoding: 'utf-8'}));
        npmRouterConfig.routes && npmRouterConfig.routes.forEach(item => {
          let routePath = item.path;
          let cmlFilePath = path.join(root, 'node_modules', npmName, 'src', routePath + '.cml');
          if (cml.utils.isFile(cmlFilePath)) {
            addEntry(cmlFilePath);
          } else {
            cml.log.error(`${cmlFilePath} is not find!`);
          }
        })

      })
    }
  }
  exports.updateEntry({ entry, cmlType, root, addEntry });

  return entry;

  function addEntry(chameleonFilePath) {
    // plugin://
    if (!chameleonFilePath) {
      return;
    }
    if (!cml.utils.isFile(chameleonFilePath)) {
      return;
    }
    if (~hasEntryedPath.indexOf(chameleonFilePath)) {
      return;
    }
    hasEntryedPath.push(chameleonFilePath);
    let entryName = cml.utils.getPureEntryName(chameleonFilePath, cmlType, root);
    // 小程序中有文件夹有@符号无法上传  决定生成样式文件路径
    entryName = cml.utils.handleSpecialChar(entryName);
    entry[entryName] = chameleonFilePath;

    // 处理json文件中引用的组件作为入口,wxml文件
    let targetObject = cml.utils.getJsonFileContent(chameleonFilePath, cmlType)
    if (targetObject && targetObject.usingComponents) {
      let usingComponents = targetObject.usingComponents;
      Object.keys(usingComponents).forEach(key => {
        let comPath = usingComponents[key];
        let { filePath } = cml.utils.handleComponentUrl(root, chameleonFilePath, comPath, cmlType);
        addEntry(filePath);
      })
    }
  }
}

exports.getWebEntry = function (options) {
  if (cml.media === 'export') {
    return exports.getWebExportEntry();
  }
  exports.copyDefaultFile(options.root, 'web', options.media);
  var entry = {};
  entry.vender = ['vue', 'vuex', 'vue-router', path.resolve(cml.root, 'configs/web_global.js')];
  if (options.babelPolyfill === true) {
    entry.vender.unshift('@babel/polyfill');
  }
  // web端插入全局样式
  if (cml.config.get().baseStyle.web === true) {
    entry.vender.push('chameleon-runtime/src/platform/web/style/index.css')
  }
  if (cml.config.get().cmss.rem === true) {
    entry.vender.unshift(path.resolve(cml.root, 'configs/default/rem.js'));
  }
  var htmlPlugins = [];
  let entryConfig = cml.config.get().entry;

  // 配置web入口
  var entryFile;
  if (entryConfig && entryConfig.web) {
    if (cml.utils.isFile(entryConfig.web)) {
      entryFile = entryConfig.web;
    } else {
      throw new Error('no such file: ' + entryConfig.web);
    }
  } else {
    entryFile = path.join(cml.projectRoot, 'node_modules/chameleon-runtime/.temp/entry.js');
  }
  var entryName = exports.getEntryName();
  entry[entryName] = entryFile;
  var chunksort = ['manifest', 'vender', 'common'];
  let filename = `${entryName}.html`;
  if (cml.config.get().templateType === 'smarty') {
    filename = `template/${entryName}.tpl`;
  }
  let template;
  if (entryConfig && entryConfig.template) {
    if (cml.utils.isFile(entryConfig.template)) {
      template = entryConfig.template;
    } else {
      throw new Error('no such file: ' + entryConfig.template);
    }
  } else {
    if (cml.config.get().templateType === 'smarty') {
      template = path.resolve(__dirname, `./default/smarty_entry.html`);
    } else {
      template = path.resolve(__dirname, `./default/html_entry.html`);
    }
  }
  var htmlConf = {
    filename: filename,
    template,
    inject: 'body',
    // hash: true,
    chunks: ['manifest', 'vender', 'common', entryName],
    chunksSortMode: function (a, b) {
      var aIndex = chunksort.indexOf(a.names[0]);
      var bIndex = chunksort.indexOf(b.names[0]);
      aIndex = aIndex < 0 ? chunksort.length + 1 : aIndex;
      bIndex = bIndex < 0 ? chunksort.length + 1 : bIndex;
      return aIndex - bIndex;
    }
  }
  if (options.console === true) {
    htmlConf.console = true
    htmlConf.consolejs = '/preview-assets/didiConsole-1.0.7.min.js'
  }
  htmlPlugins.push(new HtmlWebpackPlugin(htmlConf))
  if (options.media === 'dev') {
    let origin = path.join(__dirname, './preview.html');
    let target = path.join(cml.utils.getDevServerPath(), 'preview.html')
    fse.copySync(origin, target, {
      overwrite: true
    })
  }
  return {
    entry,
    htmlPlugins
  }
}

exports.getWebExportEntry = function () {
  var entry = {};
  let entryList = cml.config.get().web['export'].entry;
  let exportEntryFile = cml.utils.getExportEntry('web', cml.projectRoot, entryList);
  // 记录已经添加的入口，防止重复循环添加
  let hasEntryedPath = [];

  exportEntryFile.forEach(item => {
    addEntry(item);
  })
  function addEntry(chameleonFilePath) {
    // plugin://
    if (!chameleonFilePath) {
      return;
    }
    if (~hasEntryedPath.indexOf(chameleonFilePath)) {
      return;
    }
    hasEntryedPath.push(chameleonFilePath);
    let entryName = cml.utils.getPureEntryName(chameleonFilePath, 'web', cml.projectRoot);
    entry[entryName] = chameleonFilePath;
  }
  return {
    entry,
    htmlPlugins: []
  };
}

exports.getWeexEntry = function (options) {
  if (options.media === 'export') {
    return exports.getWeexExportEntry(options);
  }
  var entry = {};
  let singlePage = cml.config.get().singlePage;
  if (singlePage) {
    exports.copyDefaultFile(options.root, 'weex', options.media);
    var entryFile = [];
    let entryConfig = cml.config.get().entry;
    if (entryConfig && entryConfig.weex) {
      if (cml.utils.isFile(entryConfig.weex)) {
        entryFile.push(entryConfig.weex)
      } else {
        throw new Error('no such file: ' + entryConfig.weex);
      }
    } else {
      entryFile.push(path.join(cml.projectRoot, 'node_modules/chameleon-runtime/.temp/entry.js'));
    }
    if (options.media === 'dev') {
      entryFile.push(path.join(cml.root, 'configs/weex_liveload/liveLoad.js'))
    }
    var entryName = exports.getEntryName();
    entry[entryName] = entryFile;
  } else {
    const entries = glob.sync('./src/pages/**/*.cml');

    entries.forEach(item => {
      let name = path.basename(item);
      let entryStr = fs.readFileSync(path.resolve(__dirname, './default/single_page_entry.js'), {encoding: 'utf-8'});
      entryStr = entryStr.replace('${PAGE_PATH}', item);
      try {
          fs.accessSync(path.join(cml.projectRoot, `node_modules/chameleon-runtime/.temp`));
      } catch (err) {
          fs.mkdirSync(path.join(cml.projectRoot, `node_modules/chameleon-runtime/.temp`))
      }
      fs.writeFileSync(path.join(cml.projectRoot, `node_modules/chameleon-runtime/.temp/${name}.js`), entryStr);
      entry[name] = path.join(cml.projectRoot, `node_modules/chameleon-runtime/.temp/${name}.js`)
    })
  }

  return entry;
}

exports.getWeexExportEntry = function () {
  var entry = {};
  let entryList = cml.config.get().weex['export'].entry;
  let exportEntryFile = cml.utils.getExportEntry('weex', cml.projectRoot, entryList);
  // 记录已经添加的入口，防止重复循环添加
  let hasEntryedPath = [];
  exportEntryFile.forEach(item => {
    addEntry(item);
  })
  function addEntry(chameleonFilePath) {
    // plugin://
    if (!chameleonFilePath) {
      return;
    }
    if (~hasEntryedPath.indexOf(chameleonFilePath)) {
      return;
    }
    hasEntryedPath.push(chameleonFilePath);
    let entryName = cml.utils.getPureEntryName(chameleonFilePath, 'weex', cml.projectRoot);
    entry[entryName] = chameleonFilePath;
  }
  return entry;
}

exports.getEntryName = function () {
  return cml.config.get().projectName || 'main'
}


exports.getTempPath = function () {
  return cml.utils.getTempRoot();
}

exports.getDevServerPath = function () {
  return cml.utils.getDevServerPath();
}

let babelNpm = [
  'fs-base-chameleon',
  "chameleon-ui-builtin",
  'cml-ui',
  'chameleon-runtime',
  'chameleon-store',
  'chameleon-bridge',
  'chameleon-scroll',
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
  'webpack-liveload-middleware',
  'chameleon-weex-vue-loader',
  'babel-plugin-chameleon-import',
  'fcml-ui'
];

exports.getBabelPath = function () {

  let babelPath = [
    path.join(cml.projectRoot, 'src'),
    path.join(cml.root, 'configs')
  ]
  babelNpm.forEach(item => {
    babelPath.push(path.join(cml.projectRoot, 'node_modules', item))
    babelPath.push(path.join(cml.root, 'node_modules', item))
  })
  let configBabelPath = cml.config.get().babelPath || [];
  return configBabelPath.concat(babelPath);
}
exports.getExcludeBabelPath = function() {
  let excludeBablePath = [/(\.min\.js)/, /node_modules\/core-js/];
  let configExcludePath = cml.config.get().excludeBablePath || [];
  return excludeBablePath.concat(configExcludePath);
}

exports.getGlobalCheckWhiteList = function () {
  return [
    /node_modules[\/\\](mobx|vuex)/
  ].concat(cml.config.get().globalCheckWhiteList)
}

let hasCopy = false;
exports.copyDefaultFile = function (dir, platform, media) {
  // web和weex端同时启动时会拷贝两次，引起重新编译
  if (hasCopy) {
    return;
  }
  hasCopy = true;
  // 创建路由文件
  cml.utils.createRouterFile('web', media);
  fse.copySync(path.resolve(__dirname, './default/router.js'), path.resolve(dir, 'node_modules/chameleon-runtime/.temp/router.js'), {
    overwrite: true
  })
  fse.copySync(path.resolve(__dirname, './default/entry.js'), path.resolve(dir, 'node_modules/chameleon-runtime/.temp/entry.js'), {
    overwrite: true
  })

}

let webServerPort;
let weexLiveLoadPort;
exports.setFreePort = async function () {
  if (webServerPort && weexLiveLoadPort) {
    return;
  }
  if (cml.utils.is(cml.config.get().devPort, 'Number')) {
    webServerPort = cml.config.get().devPort;
  } else {
    await portfinder.getPortPromise({
      port: 8000, // minimum port
      stopPort: 8999 // maximum port
    })
      .then((port) => {
        webServerPort = port;
      }, (err) => {
        throw err;
      });
  }

  await portfinder.getPortPromise({
    port: 3000, // minimum port
    stopPort: 3999 // maximum port
  })
    .then((port) => {
      weexLiveLoadPort = port;
    }, (err) => {
      throw err;
    })
}

exports.getFreePort = function () {
  if (webServerPort && weexLiveLoadPort) {
    return {
      webServerPort,
      weexLiveLoadPort
    }
  } else {
    cml.log.error('请先调用setFreePort');
  }
}

