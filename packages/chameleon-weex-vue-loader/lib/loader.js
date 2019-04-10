// @todo: support hot reload
// @todo: support functional check
// @tips: not support CSS Modules
// @tips: not support CssSourceMap
// @tips: not support isServer
// @tips: not support isScoped

var loaderUtils = require('loader-utils')
var assign = require('object-assign')
var parse = require('./parser')
var path = require('path')
var normalize = require('./normalize')
var genId = require('./gen-id')

// internal lib loaders
var selectorPath = normalize.lib('selector')
var templateLoaderPath = normalize.lib('template-loader')
var templateCompilerPath = normalize.lib('template-compiler')
var styleRewriterPath = normalize.lib('style-rewriter')
var styleLoaderPath = normalize.lib('style-loader')
var scriptLoaderPath = normalize.lib('script-loader')

// dep loaders
// var styleLoaderPath = normalize.dep('vue-style-loader')
// var hotReloadAPIPath = normalize.dep('vue-hot-reload-api')

var hasBabel = false
try {
  hasBabel = !!require('babel-loader')
} catch (e) {}

var hasBuble = false
try {
  hasBuble = !!require('buble-loader')
} catch (e) {}

var rewriterInjectRE = /\b(css(?:-loader)?(?:\?[^!]+)?)(?:!|$)/

var defaultLang = {
  template: 'html',
  styles: 'css',
  script: 'js'
}

var checkNamedExports =
  'if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {' +
  'console.error("named exports are not supported in *.vue files.")}\n'

function hasRecyclable (template) {
  return !!(template && template.attrs && template.attrs.recyclable)
}

// When extracting parts from the source vue file, we want to apply the
// loaders chained before vue-loader, but exclude some loaders that simply
// produces side effects such as linting.
function getRawRequest (
  { resource, loaderIndex, loaders },
  excludedPreLoaders = /eslint-loader/
) {
  return loaderUtils.getRemainingRequest({
    resource: resource,
    loaderIndex: loaderIndex,
    loaders: loaders.filter(loader => !excludedPreLoaders.test(loader.path))
  })
}


module.exports = function (content) {
  this.cacheable()
  // var isServer = (this.options || this._compiler.options).target === 'node'
  // var isServer = false
  var loaderContext = this
  var query = loaderUtils.getOptions(this) || {}
  var params = this.resourceQuery && loaderUtils.parseQuery(this.resourceQuery)
  var options = (this.options || this._compiler.options).__vueOptions__ = Object.assign({}, (this.options || this._compiler.options).vue, query)
  var filePath = this.resourcePath
  var fileName = path.basename(filePath)
  var moduleId = 'data-v-' + genId(path.relative(process.cwd(), filePath))
  var styleRewriter = styleRewriterPath + '?id=' + moduleId

  var isProduction = this.minimize || process.env.NODE_ENV === 'production'

  // var needCssSourceMap =
  //   !isProduction &&
  //   this.sourceMap &&
  //   options.cssSourceMap !== false
  // var needCssSourceMap = false

  var babelOptions = hasBabel && options.babel && options.babel.query ? '?' + JSON.stringify(options.babel.query) : ''
  var bubleOptions = hasBuble && options.buble ? '?' + JSON.stringify(options.buble) : ''
  var defaultLoaders = {
    html: templateCompilerPath + '?id=' + moduleId,
    // css: (isServer ? '' : styleLoaderPath + '!') + 'css-loader' + (needCssSourceMap ? '?sourceMap' : ''),
    css: styleLoaderPath,
    js: scriptLoaderPath + '!' + (hasBuble ? ('buble-loader' + bubleOptions) : hasBabel ? ('babel-loader' + babelOptions) : ''),
    scss: ['sass-loader'],
    sass: [{
      loader: 'sass-loader',
      options: {
        indentedSyntax: true
      }
    }],
    less: ['less-loader'],
    stylus: ['stylus-loader'],
    styl: ['stylus-loader']
  }
  // check if there are custom loaders specified via
  // webpack config, otherwise use defaults
  var loaders = assign({}, defaultLoaders, options.loaders)

  const rawRequest = getRawRequest(loaderContext, options.excludedPreLoaders)
  function getRequire (type, part, index, scoped) {
    return 'require(' +
      getRequireString(type, part, index, scoped) +
    ')\n'
  }

  function getRequireString (type, part, index, scoped) {
    return loaderUtils.stringifyRequest(loaderContext,
      // disable all configuration loaders
      '!!' +
      // get loader string for pre-processors
      getLoaderString(type, part, index, scoped) +
      // select the corresponding part from the vue file
      getSelectorString(type, index || 0) +
      // the url to the actual vuefile
      rawRequest
      // filePath
    )
  }

  function getRequireForImport (type, impt, scoped) {
    return 'require(' +
      getRequireForImportString(type, impt, scoped) +
    ')\n'
  }

  function getRequireForImportString (type, impt, scoped) {
    return loaderUtils.stringifyRequest(loaderContext,
      '!!' +
      getLoaderString(type, impt, -1, scoped) +
      impt.src
    )
  }

  function addCssModulesToLoader (loader, part, index) {
    if (!part.module) return loader
    var option = options.cssModules || {}
    var DEFAULT_OPTIONS = {
      modules: true,
      importLoaders: true
    }
    var OPTIONS = {
      localIdentName: '[hash:base64]'
    }
    return loader.replace(/((?:^|!)css(?:-loader)?)(\?[^!]*)?/, function (m, $1, $2) {
      // $1: !css-loader
      // $2: ?a=b
      var query = loaderUtils.parseQuery($2)
      Object.assign(query, OPTIONS, option, DEFAULT_OPTIONS)
      if (index !== -1) {
        // Note:
        //   Class name is generated according to its filename.
        //   Different <style> tags in the same .vue file may generate same names.
        //   Append `_[index]` to class name to avoid this.
        query.localIdentName += '_' + index
      }
      return $1 + '?' + JSON.stringify(query)
    })
  }

  function stringifyLoaders (loaders) {
    return loaders.map(function (obj) {
      return obj && typeof obj === 'object' && typeof obj.loader === 'string'
        ? obj.loader + (obj.options ? '?' + JSON.stringify(obj.options) : '')
        : obj
    }).join('!')
  }

  function getLoaderString (type, part, index, scoped) {
    var lang = part.lang
    var loader = loaders[defaultLang[type]]
    var rewriter = type === 'styles' ? styleRewriter + (scoped ? '&scoped=true!' : '!') : ''
    var injectString = (type === 'script' && query.inject) ? 'inject!' : ''
    if (loader !== undefined) {
      if (Array.isArray(loader)) {
        loader = stringifyLoaders(loader)
      } else {
        loader = stringifyLoaders([loader])        
      }
      // add css modules
      if (type === 'styles') {
        let stylelang = part.lang || defaultLang[type]
        let styleLoader = options.loaders[stylelang]
        //如果有传入loader，则用style-compile + rewrite + 传入的loader
        if(styleLoader) {
          if (Array.isArray(styleLoader)) {
            styleLoader = stringifyLoaders(styleLoader)
          }
          styleLoader = addCssModulesToLoader(styleLoader, part, index)
          styleLoader =  ensureBang(defaultLoaders.css) + ensureBang(rewriter) + styleLoader

          return ensureBang(styleLoader)
        } 
        //如果没有传入的loader 就走之前的逻辑
        else {
          loader = addCssModulesToLoader(loader, part, index)
         
          // while lang existed, the `style-loader` is also needed.
          if (lang && Array.isArray(loaders[lang])) {
            loader += '!' + stringifyLoaders(loaders[lang])
          }
        }

      }
      if (type === 'template') {
        if (hasRecyclable(part)) {
          loader += '&recyclable=true'
        }
        if (lang) {
          loader += '!' + templateLoaderPath + '?raw&engine=' + lang + '!'
        }
      }
      // inject rewriter before css/html loader for
      // extractTextPlugin use cases
      if (rewriterInjectRE.test(loader)) {
        loader = loader.replace(rewriterInjectRE, function (m, $1) {
          return ensureBang($1) + rewriter
        })
      } else {

        loader = ensureBang(loader) + rewriter
      }
      return injectString + ensureBang(loader)
    } else {
      // unknown lang, infer the loader to be used
      switch (type) {
        case 'template':
          return defaultLoaders.html + '!' + templateLoaderPath + '?raw&engine=' + lang + '!'
        case 'styles':
          loader = addCssModulesToLoader(defaultLoaders.css, part, index)
          return loader + '!' + rewriter + ensureBang(ensureLoader(lang))
        case 'script':
          return injectString + ensureBang(ensureLoader(lang))
      }
    }
  }

  // sass => sass-loader
  // sass-loader => sass-loader
  // sass?indentedsyntax!css => sass-loader?indentedSyntax!css-loader
  function ensureLoader (lang) {
    return lang.split('!').map(function (loader) {
      return loader.replace(/^([\w-]+)(\?.*)?/, function (_, name, query) {
        return (/-loader$/.test(name) ? name : (name + '-loader')) + (query || '')
      })
    }).join('!')
  }

  function getSelectorString (type, index) {
    return selectorPath +
      '?type=' + type +
      '&index=' + index + '!'
  }

  function ensureBang (loader) {
    if (loader.charAt(loader.length - 1) !== '!') {
      return loader + '!'
    } else {
      return loader
    }
  }

  var parts = parse(content, fileName, this.sourceMap)
  // var hasGlobal = parts.styles.some(function (s) { return !!s.global })
  // var scopeId = hasGlobal ? '@GLOBAL' : ('data-v-' + genId(filePath))
  var scopeId = 'data-v-' + genId(filePath)
  var output = 'var __vue_exports__, __vue_options__\n'

  // css modules
  // output += 'var __vue_styles__ = {}\n'
  output += 'var __vue_styles__ = []\n'
  // var cssModules = {}

  // add requires for styles
  if (parts.styles.length) {
    output += '\n/* styles */\n'
    parts.styles.forEach(function (style, i) {
      // var moduleName = (style.module === true) ? '$style' : style.module
      // var moduleName

      // require style
      // if (isServer && !moduleName) return
      // var requireString = style.src
      //   ? getRequireForImport('styles', style, style.scoped)
      //   : getRequire('styles', style, i, style.scoped)
      var requireString = style.src
        ? getRequireForImport('styles', style)
        : getRequire('styles', style, i)

      // setCssModule
      // if (moduleName) {
      //   if (moduleName in cssModules) {
      //     loaderContext.emitError('CSS module name "' + moduleName + '" is not unique!')
      //     output += requireString
      //   } else {
      //     cssModules[moduleName] = true

      //     // `style-loader` exposes the name-to-hash map directly
      //     // `css-loader` exposes it in `.locals`
      //     // We drop `style-loader` in SSR, and add `.locals` here.
      //     // if (isServer) {
      //     //   requireString += '.locals'
      //     // }

      //     output += '__vue_styles__["' + moduleName + '"] = ' + requireString + '\n'
      //   }
      // } else {
      //   output += requireString
      // }

      // output += requireString
      output += '__vue_styles__.push(' + requireString + ')\n'
    })
  }

  // add require for script
  var script = parts.script
  if (script) {
    output += '\n/* script */\n'
    output +=
      '__vue_exports__ = ' + (
        script.src
          ? getRequireForImport('script', script)
          : getRequire('script', script)
      )
  }

  var exports =
    '__vue_options__ = __vue_exports__ = __vue_exports__ || {}\n' +
    // ES6 modules interop
    'if (\n' +
    '  typeof __vue_exports__.default === "object" ||\n' +
    '  typeof __vue_exports__.default === "function"\n' +
    ') {\n' +
      (isProduction ? '' : checkNamedExports) +
      '__vue_options__ = __vue_exports__ = __vue_exports__.default\n' +
    '}\n' +
    // constructor export interop
    'if (typeof __vue_options__ === "function") {\n' +
    '  __vue_options__ = __vue_options__.options\n' +
    '}\n' +
    // add filename in dev
    (isProduction ? '' : ('__vue_options__.__file = ' + JSON.stringify(filePath))) + '\n'

  // add require for template
  var template = parts.template
  if (template) {
    output += '\n/* template */\n'
    output += 'var __vue_template__ = ' + (
      template.src
        ? getRequireForImport('template', template)
        : getRequire('template', template)
    )
    // attach render functions to exported options
    exports +=
      '__vue_options__.render = __vue_template__.render\n' +
      (hasRecyclable(template) ? '__vue_options__["@render"] = __vue_template__["@render"]\n' : '') +
      '__vue_options__.staticRenderFns = __vue_template__.staticRenderFns\n'
  }

  // attach scoped id
  if (parts.styles.length) {
    exports += '__vue_options__._scopeId = "' + scopeId + '"\n'
  }

  // if (Object.keys(cssModules).length) {
  //   // inject style modules as computed properties
  //   exports +=
  //     'if (!__vue_options__.computed) __vue_options__.computed = {}\n' +
  //     'Object.keys(__vue_styles__).forEach(function (key) {\n' +
  //       'var module = __vue_styles__[key]\n' +
  //       '__vue_options__.computed[key] = function () { return module }\n' +
  //     '})\n'
  // }

  exports += '__vue_options__.style = __vue_options__.style || {}\n' +
  '__vue_styles__.forEach(function (module) {\n' +
  '  for (var name in module) {\n' +
  '    __vue_options__.style[name] = module[name]\n' +
  '  }\n' +
  '})\n'

  // support to register static styles
  exports += 'if (typeof __register_static_styles__ === "function") {\n' +
  '  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)\n' +
  '}\n'

  if (!query.inject) {
    output += exports
    // hot reload
    // if (
    //   !isServer &&
    //   !isProduction &&
    //   (parts.script || parts.template)
    // ) {
    //   output +=
    //     '\n/* hot reload */\n' +
    //     'if (module.hot) {(function () {\n' +
    //     '  var hotAPI = require("' + hotReloadAPIPath + '")\n' +
    //     '  hotAPI.install(require("vue"), false)\n' +
    //     '  if (!hotAPI.compatible) return\n' +
    //     '  module.hot.accept()\n' +
    //     '  if (!module.hot.data) {\n' +
    //     // initial insert
    //     '    hotAPI.createRecord("' + moduleId + '", __vue_options__)\n' +
    //     '  } else {\n' +
    //     // update
    //     '    hotAPI.reload("' + moduleId + '", __vue_options__)\n' +
    //     '  }\n' +
    //     '})()}\n'
    // }
    // check functional
    // if (!isProduction) {
    //   output +=
    //     'if (__vue_options__.functional) {console.error("' +
    //       '[vue-loader] ' + fileName + ': functional components are not ' +
    //       'supported and should be defined in plain js files using render ' +
    //       'functions.' +
    //     '")}\n'
    // }
    // final export
    if (options.esModule) {
      output += '\nexports.__esModule = true;\nexports["default"] = __vue_exports__\n'
    } else {
      output += '\nmodule.exports = __vue_exports__\n'
    }
  } else {
    // inject-loader support
    output +=
      '\n/* dependency injection */\n' +
      'module.exports = function (injections) {\n' +
      '  __vue_exports__ = __vue_exports__(injections)\n' +
      exports +
      '  return __vue_exports__\n' +
      '}'
  }

  if (params && params.entry) {
    output += 'module.exports.el = \'' + params.entry + '\'\n' +
      'new Vue(module.exports)\n'
  }
  console.log(output)
debugger
  // done
  return output
}
