const querystring = require('querystring')
const loaderUtils = require('loader-utils')
const normalize = require('./utils/normalize')
const tryRequire = require('./utils/try-require')
const styleCompilerPath = normalize.lib('style-compiler/index')

// internal lib loaders
const selectorPath = normalize.lib('selector')
const templateCompilerPath = normalize.lib('template-compiler/index')
const templatePreprocessorPath = normalize.lib('template-compiler/preprocessor')

// dep loaders
const styleLoaderPath = normalize.dep('vue-style-loader')

// check whether default js loader exists
const hasBabel = !!tryRequire('babel-loader')
const hasBuble = !!tryRequire('buble-loader')

const rewriterInjectRE = /\b(css(?:-loader)?(?:\?[^!]+)?)(?:!|$)/

const defaultLang = {
  template: 'html',
  styles: 'css',
  script: 'js'
}

const postcssExtensions = [
  'postcss', 'pcss', 'sugarss', 'sss'
]

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

// sass => sass-loader
// sass-loader => sass-loader
// sass?indentedSyntax!css => sass-loader?indentedSyntax!css-loader
function ensureLoader (lang) {
  return lang
    .split('!')
    .map(loader =>
      loader.replace(
        /^([\w-]+)(\?.*)?/,
        (_, name, query) =>
          (/-loader$/.test(name) ? name : name + '-loader') + (query || '')
      )
    )
    .join('!')
}

function ensureBang (loader) {
  if (loader.charAt(loader.length - 1) !== '!') {
    return loader + '!'
  } else {
    return loader
  }
}

function resolveLoaders (
  optionsId,
  options,
  moduleId,
  isProduction,
  hasScoped,
  hasComment,
  hasFunctionalTemplate,
  needCssSourceMap
) {
  let cssLoaderOptions = ''
  if (needCssSourceMap) {
    cssLoaderOptions += '?sourceMap'
  }
  if (isProduction) {
    cssLoaderOptions += (cssLoaderOptions ? '&' : '?') + 'minimize'
  }

  const bubleTemplateOptions = Object.assign({}, options.buble)
  bubleTemplateOptions.transforms = Object.assign({}, bubleTemplateOptions.transforms)
  bubleTemplateOptions.transforms.stripWithFunctional = hasFunctionalTemplate

  const bubleOptions = hasBuble && options.buble
    ? '?' + JSON.stringify(options.buble)
    : ''

  const templateCompilerOptions =
    '?' +
    JSON.stringify({
      id: moduleId,
      hasScoped,
      hasComment,
      optionsId,
      buble: bubleTemplateOptions
    })

  const defaultLoaders = {
    html: templateCompilerPath + templateCompilerOptions,
    css: options.extractCSS
      ? getCSSExtractLoader(null, options, cssLoaderOptions)
      : styleLoaderPath + '!' + 'css-loader' + cssLoaderOptions,
    js: hasBuble
      ? 'buble-loader' + bubleOptions
      : hasBabel ? 'babel-loader' : ''
  }

  function getCSSExtractLoader (lang) {
    let extractor
    const op = options.extractCSS
    // extractCSS option is an instance of ExtractTextPlugin
    if (typeof op.extract === 'function') {
      extractor = op
    } else {
      extractor = tryRequire('extract-text-webpack-plugin')
      if (!extractor) {
        throw new Error(
          '[vue-loader] extractCSS: true requires extract-text-webpack-plugin ' +
            'as a peer dependency.'
        )
      }
    }
    const langLoader = lang ? ensureBang(ensureLoader(lang)) : ''
    return extractor.extract({
      use: 'css-loader' + cssLoaderOptions + '!' + langLoader,
      fallback: 'vue-style-loader'
    })
  }

  return {
    defaultLoaders,
    getCSSExtractLoader,
    loaders: Object.assign({}, defaultLoaders, options.loaders),
    preLoaders: options.preLoaders || {},
    postLoaders: options.postLoaders || {}
  }
}

module.exports = function createHelpers (
  optionsId,
  loaderContext,
  options,
  moduleId,
  parts,
  isProduction,
  hasScoped,
  hasComment,
  hasFunctionalTemplate,
  needCssSourceMap
) {
  const rawRequest = getRawRequest(loaderContext, options.excludedPreLoaders)

  const {
    defaultLoaders,
    getCSSExtractLoader,
    loaders,
    preLoaders,
    postLoaders
  } = resolveLoaders(
    optionsId,
    options,
    moduleId,
    isProduction,
    hasScoped,
    hasComment,
    hasFunctionalTemplate,
    needCssSourceMap
  )

  function getRequire (type, part, index, scoped) {
    return 'require(' + getRequestString(type, part, index, scoped) + ')'
  }

  function getImport (type, part, index, scoped) {
    return (
      'import __vue_' + type + '__ from ' +
      getRequestString(type, part, index, scoped)
    )
  }

  function getNamedExports (type, part, index, scoped) {
    return (
      'export * from ' +
      getRequestString(type, part, index, scoped)
    )
  }

  function getRequestString (type, part, index, scoped) {
    return loaderUtils.stringifyRequest(
      loaderContext,
      // disable all configuration loaders
      '!!' +
        // get loader string for pre-processors
        getLoaderString(type, part, index, scoped) +
        // select the corresponding part from the vue file
        getSelectorString(type, index || 0) +
        // the url to the actual vue file, including remaining requests
        rawRequest
    )
  }

  function getRequireForSrc (type, impt, scoped) {
    return 'require(' + getSrcRequestString(type, impt, scoped) + ')'
  }

  function getImportForSrc (type, impt, scoped) {
    return (
      'import __vue_' + type + '__ from ' +
      getSrcRequestString(type, impt, scoped)
    )
  }

  function getNamedExportsForSrc (type, impt, scoped) {
    return (
      'export * from ' +
      getSrcRequestString(type, impt, scoped)
    )
  }

  function getSrcRequestString (type, impt, scoped) {
    return loaderUtils.stringifyRequest(
      loaderContext,
      '!!' + getLoaderString(type, impt, -1, scoped) + impt.src
    )
  }

  function addCssModulesToLoader (loader, part, index) {
    if (!part.module) return loader
    const option = options.cssModules || {}
    const DEFAULT_OPTIONS = {
      modules: true
    }
    const OPTIONS = {
      localIdentName: '[local]_[hash:base64:8]',
      importLoaders: 1
    }
    return loader.replace(/((?:^|!)css(?:-loader)?)(\?[^!]*)?/, (m, $1, $2) => {
      // $1: !css-loader
      // $2: ?a=b
      const query = loaderUtils.parseQuery($2 || '?')
      Object.assign(query, OPTIONS, option, DEFAULT_OPTIONS)
      if (index > 0) {
        // Note:
        //   Class name is generated according to its filename.
        //   Different <style> tags in the same .vue file may generate same names.
        //   Append `_[index]` to class name to avoid this.
        query.localIdentName += '_' + index
      }
      return $1 + '?' + JSON.stringify(query)
    })
  }

  function buildCustomBlockLoaderString (attrs) {
    const noSrcAttrs = Object.assign({}, attrs)
    delete noSrcAttrs.src
    const qs = querystring.stringify(noSrcAttrs)
    return qs ? '?' + qs : qs
  }

  // stringify an Array of loader objects
  function stringifyLoaders (loaders) {
    return loaders
      .map(
        obj =>
          obj && typeof obj === 'object' && typeof obj.loader === 'string'
            ? obj.loader +
              (obj.options ? '?' + JSON.stringify(obj.options) : '')
            : obj
      )
      .join('!')
  }

  function getLoaderString (type, part, index, scoped) {
    let loader = getRawLoaderString(type, part, index, scoped)
    const lang = getLangString(type, part)
    if (preLoaders[lang]) {
      loader = loader + ensureBang(preLoaders[lang])
    }
    if (postLoaders[lang]) {
      loader = ensureBang(postLoaders[lang]) + loader
    }
    return loader
  }

  function getLangString (type, { lang }) {
    if (type === 'script' || type === 'template' || type === 'styles') {
      return lang || defaultLang[type]
    } else {
      return type
    }
  }

  function getRawLoaderString (type, part, index, scoped) {
    let lang = part.lang || defaultLang[type]

    let styleCompiler = ''
    if (type === 'styles') {
      // style compiler that needs to be applied for all styles
      styleCompiler =
        styleCompilerPath +
        '?' +
        JSON.stringify({
          // a marker for vue-style-loader to know that this is an import from a vue file
          optionsId,
          vue: true,
          id: scoped ? moduleId : undefined,
          scoped: !!scoped,
          sourceMap: needCssSourceMap
        }) +
        '!'
      // normalize scss/sass/postcss if no specific loaders have been provided
      if (!loaders[lang]) {
        if (postcssExtensions.indexOf(lang) !== -1) {
          lang = 'css'
        } else if (lang === 'sass') {
          lang = 'sass?indentedSyntax'
        } else if (lang === 'scss') {
          lang = 'sass'
        }
      }
    }

    let loader =
      options.extractCSS && type === 'styles'
        ? loaders[lang] || getCSSExtractLoader(lang)
        : loaders[lang]

    if (loader != null) {
      if (Array.isArray(loader)) {
        loader = stringifyLoaders(loader)
      } else if (typeof loader === 'object') {
        loader = stringifyLoaders([loader])
      }
      if (type === 'styles') {
        // add css modules
        loader = addCssModulesToLoader(loader, part, index)
        // inject rewriter before css loader for extractTextPlugin use cases
        if (rewriterInjectRE.test(loader)) {
          loader = loader.replace(
            rewriterInjectRE,
            (m, $1) => ensureBang($1) + styleCompiler
          )
        } else {
          loader = ensureBang(loader) + styleCompiler
        }
      }
      // if user defines custom loaders for html, add template compiler to it
      if (type === 'template' && loader.indexOf(defaultLoaders.html) < 0) {
        loader = defaultLoaders.html + '!' + loader
      }
      return ensureBang(loader)
    } else {
      // unknown lang, infer the loader to be used
      switch (type) {
        case 'template':
          return (
            defaultLoaders.html +
            '!' +
            templatePreprocessorPath +
            `?engine=${lang}` +
            `&optionsId=${optionsId}` +
            '!'
          )
        case 'styles':
          loader = addCssModulesToLoader(defaultLoaders.css, part, index)
          return loader + '!' + styleCompiler + ensureBang(ensureLoader(lang))
        case 'script':
          return ensureBang(ensureLoader(lang))
        default:
          loader = loaders[type]
          if (Array.isArray(loader)) {
            loader = stringifyLoaders(loader)
          }
          return ensureBang(loader + buildCustomBlockLoaderString(part.attrs))
      }
    }
  }

  function getSelectorString (type, index) {
    return (
      selectorPath +
      '?type=' +
      (type === 'script' || type === 'template' || type === 'styles'
        ? type
        : 'customBlocks') +
      '&index=' + index +
      '!'
    )
  }

  return {
    loaders,
    getRequire,
    getImport,
    getNamedExports,
    getRequireForSrc,
    getImportForSrc,
    getNamedExportsForSrc,
    getRequestString,
    getSrcRequestString
  }
}
