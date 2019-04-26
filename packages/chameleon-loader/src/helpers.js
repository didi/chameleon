const querystring = require('querystring')
const loaderUtils = require('loader-utils')
const normalize = require('./utils/normalize')


const selectorPath = normalize.lib('selector')
const wxmlSelectorPath = normalize.lib('cml-compile/wxml-selector')

// dep loaders
const styleLoaderPath = normalize.dep('vue-style-loader')

// check whether default js loader exists
const hasBabel = true
const hasBuble = false

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


  const defaultLoaders = {
    css: styleLoaderPath + '!' + 'css-loader' + cssLoaderOptions,
    js: 'babel-loader'
  }


  return {
    defaultLoaders,
    loaders: Object.assign({}, defaultLoaders, options.loaders),
    preLoaders: options.preLoaders || {},
    postLoaders: options.postLoaders || {}
  }
}

module.exports = function createHelpers (
  loaderContext,
  options,
  moduleId,
  parts,
  isProduction,
  hasScoped,
  hasComment,
  hasFunctionalTemplate,
  needCssSourceMap,
  fileType
) {
  // console.log(fileType)
  const rawRequest = getRawRequest(loaderContext, options.excludedPreLoaders)

  const {
    defaultLoaders,
    loaders,
    preLoaders,
    postLoaders
  } = resolveLoaders(
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

  function getWxmlRequest(type) {
    return 'require(' + getWxmlRequestString(type) + ')'
  }

  function getWxmlRequestString(type) {
    const part = {}
    const index = 0;
    const scoped = false;

    let loaderString = '!!' +
    // get loader string for pre-processors
    getLoaderString(type, part, index, scoped);

    if (options.afterWxSelector) {
      loaderString += // 微信端在selector 拼接差异化代码后做replace
      stringifyLoaders(options.afterWxSelector) + '!' ;
    }

    loaderString +=
    // select the corresponding part from the vue file
    `${wxmlSelectorPath}?type=${type}!` +
    // the url to the actual vue file, including remaining requests
    rawRequest;


    return loaderUtils.stringifyRequest(
      loaderContext,
      loaderString
    )
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

    let loaderString = '!!' +
    // get loader string for pre-processors
    getLoaderString(type, part, index, scoped);

    if (options.afterWxSelector) {
      loaderString += // 微信端在selector 拼接差异化代码后做replace
      stringifyLoaders(options.afterWxSelector) + '!' ;
    }

    loaderString +=
    // select the corresponding part from the vue file
    getSelectorString(type, index || 0) +
    // the url to the actual vue file, including remaining requests
    rawRequest;


    return loaderUtils.stringifyRequest(
      loaderContext,
      loaderString
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
    if (!part.module) {return loader}
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

    let loader = loaders[lang]

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
            (m, $1) => ensureBang($1)
          )
        } else {
          loader = ensureBang(loader)
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
      '&fileType=' + fileType +
      '&media=' + options.media +
      '&cmlType=' + options.cmlType +
      '&isInjectBaseStyle=' + options.isInjectBaseStyle +
      `&check=${JSON.stringify(options.check)}` +
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
    getSrcRequestString,
    getWxmlRequest
  }
}
