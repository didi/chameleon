const path = require('path')
const hash = require('hash-sum')
const parse = require('./parser')
const createHelpers = require('./helpers')
const loaderUtils = require('loader-utils')
const normalize = require('./utils/normalize')
const { saveOptions } = require('./utils/options-cache')
const hotReloadAPIPath = normalize.dep('vue-hot-reload-api')
const componentNormalizerPath = normalize.lib('runtime/component-normalizer')

module.exports = function (content) {
  let output = ''

  const loaderContext = this
  const isServer = this.target === 'node'
  const isProduction = this.minimize || process.env.NODE_ENV === 'production'

  const rawOptions = loaderUtils.getOptions(this)

  // share options between the main loader of style/template loaders.
  // to support having multiple uses of vue-loader with different options,
  // we cache and retrieve options for each unique options object.
  const optionsId = saveOptions(rawOptions)

  const options = rawOptions || {}

  // shadow mode is an internal option
  // enabled via vue-cli's --target web-component
  const isShadowMode = !!options.shadowMode

  const filePath = this.resourcePath
  const fileName = path.basename(filePath)

  const context = (
    this.rootContext ||
    (this.options && this.options.context) ||
    process.cwd()
  )
  const sourceRoot = path.dirname(path.relative(context, filePath))
  const shortFilePath = path.relative(context, filePath).replace(/^(\.\.[\\\/])+/, '')
  const moduleId = 'data-v-' + hash(isProduction ? (shortFilePath + '\n' + content) : shortFilePath)

  const needCssSourceMap = (
    !isProduction &&
    this.sourceMap &&
    options.cssSourceMap !== false
  )

  const parts = parse(
    content,
    fileName,
    this.sourceMap,
    sourceRoot,
    needCssSourceMap
  )

  const hasScoped = parts.styles.some(({ scoped }) => scoped)
  const templateAttrs = parts.template && parts.template.attrs && parts.template.attrs
  const hasComment = templateAttrs && templateAttrs.comments
  const hasFunctionalTemplate = templateAttrs && templateAttrs.functional

  const {
    loaders,
    getRequire,
    getImport,
    getNamedExports,
    getRequireForSrc,
    getImportForSrc,
    getNamedExportsForSrc,
    getRequestString,
    getSrcRequestString
  } = createHelpers(
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
  )

  const needsHotReload = (
    !isServer &&
    !isProduction &&
    (parts.script || parts.template) &&
    options.hotReload !== false
  )
  if (needsHotReload) {
    output += 'var disposed = false\n'
  }

  // resolve <style> blocks into a `injectStyle` function
  // - normal mode: injectStyle contains requires to modules that directly
  //                inject styles on import
  // - server mode: injectStyle contains required modules with injectors
  //                (exposed as __inject__ by vue-style-loader) so that they
  //                can be called with ssrContext
  // - shadow mode: injectStyle contains required modules with injectors and
  //                injects to root component's shadowRoot.
  let cssModules
  if (parts.styles.length) {
    const needsExplicitInjection = isServer || isShadowMode
    let styleInjectionCode = 'function injectStyle (context) {\n'
    if (needsHotReload) {
      styleInjectionCode += `  if (disposed) return\n`
    }
    if (needsExplicitInjection) {
      styleInjectionCode += `var i\n`
    }
    parts.styles.forEach((style, i) => {
      // require style
      let requireString = style.src
        ? getRequireForSrc('styles', style, style.scoped)
        : getRequire('styles', style, i, style.scoped)

      const hasStyleLoader = requireString.indexOf('style-loader') > -1
      const hasVueStyleLoader = requireString.indexOf('vue-style-loader') > -1
      // vue-style-loader exposes inject functions in SSR or shadow mode so they
      // are always called
      const invokeStyle =
        needsExplicitInjection && hasVueStyleLoader
          ? code => `;(i=${code},i.__inject__&&i.__inject__(context),i)\n`
          : code => `  ${code}\n`

      const moduleName = style.module === true ? '$style' : style.module
      // setCssModule
      if (moduleName) {
        if (!cssModules) {
          cssModules = {}
          if (needsHotReload) {
            output += `var cssModules = {}\n`
          }
        }
        if (moduleName in cssModules) {
          loaderContext.emitError(
            'CSS module name "' + moduleName + '" is not unique!'
          )
          styleInjectionCode += invokeStyle(requireString)
        } else {
          cssModules[moduleName] = true

          // `(vue-)style-loader` exposes the name-to-hash map directly
          // `css-loader` exposes it in `.locals`
          // add `.locals` if the user configured to not use style-loader.
          if (!hasStyleLoader) {
            requireString += '.locals'
          }

          if (!needsHotReload) {
            styleInjectionCode += invokeStyle(
              'this["' + moduleName + '"] = ' + requireString
            )
          } else {
            // handle hot reload for CSS modules.
            // we store the exported locals in an object and proxy to it by
            // defining getters inside component instances' lifecycle hook.
            styleInjectionCode +=
              invokeStyle(`cssModules["${moduleName}"] = ${requireString}`) +
              `Object.defineProperty(this, "${moduleName}", { get: function () { return cssModules["${moduleName}"] }})\n`

            const requirePath = style.src
              ? getSrcRequestString('styles', style, style.scoped)
              : getRequestString('styles', style, i, style.scoped)

            output +=
              `module.hot && module.hot.accept([${requirePath}], function () {\n` +
              // 1. check if style has been injected
              `  var oldLocals = cssModules["${moduleName}"]\n` +
              `  if (!oldLocals) return\n` +
              // 2. re-import (side effect: updates the <style>)
              `  var newLocals = ${requireString}\n` +
              // 3. compare new and old locals to see if selectors changed
              `  if (JSON.stringify(newLocals) === JSON.stringify(oldLocals)) return\n` +
              // 4. locals changed. Update and force re-render.
              `  cssModules["${moduleName}"] = newLocals\n` +
              `  require("${hotReloadAPIPath}").rerender("${moduleId}")\n` +
              `})\n`
          }
        }
      } else {
        styleInjectionCode += invokeStyle(requireString)
      }
    })
    styleInjectionCode += '}\n'
    output += styleInjectionCode
    output += 'injectStyle();\n'
  }

  // <script>
  output += '/* script */\n'
  const script = parts.script
  if (script) {
    output += script.src
      ? (
          getNamedExportsForSrc('script', script) + '\n' +
          getImportForSrc('script', script)
        )
      : (
          getNamedExports('script', script) + '\n' +
          getImport('script', script)
        ) + '\n'
  } else {
    output += 'var __vue_script__ = null\n'
  }

  // <template>
  output += '/* template */\n'
  const template = parts.template
  if (template) {
    output += `import {` +
      `render as __vue_render__, ` +
      `staticRenderFns as __vue_static_render_fns__` +
    `} from ${
      template.src
        ? getSrcRequestString('template', template)
        : getRequestString('template', template)
    }\n`
  } else {
    output += 'var __vue_render__, __vue_static_render_fns__\n'
  }

  // <template functional>
  output += '/* template functional */\n'
  output +=
    'var __vue_template_functional__ = ' +
    (hasFunctionalTemplate ? 'true' : 'false') +
    '\n'

  // style
  // the injection function is passed to the normalizer and injected into
  // component lifecycle hooks.
  output += '/* styles */\n'
  output +=
    'var __vue_styles__ = null' +
    // (parts.styles.length ? 'injectStyle' : 'null') +
    '\n'

  // scopeId
  output += '/* scopeId */\n'
  output +=
    'var __vue_scopeId__ = ' +
    (hasScoped ? JSON.stringify(moduleId) : 'null') +
    '\n'

  // moduleIdentifier (server only)
  output += '/* moduleIdentifier (server only) */\n'
  output +=
    'var __vue_module_identifier__ = ' +
    (isServer ? JSON.stringify(hash(this.request)) : 'null') +
    '\n'

  // we require the component normalizer function, and call it like so:
  // normalizeComponent(
  //   scriptExports,
  //   compiledTemplate,
  //   hasFunctionalTemplate,
  //   injectStyles,
  //   scopeId,
  //   moduleIdentifier, (server only)
  //   isShadowMode (vue-cli only)
  // )
  const componentNormalizerRequest = loaderUtils.stringifyRequest(
    loaderContext,
    '!' + componentNormalizerPath
  )
  output +=
    `import normalizeComponent from ${componentNormalizerRequest}\n` +
    'var Component = normalizeComponent(\n' +
    `  __vue_script__,\n` +
    `  __vue_render__,\n` +
    `  __vue_static_render_fns__,\n` +
    '  __vue_template_functional__,\n' +
    '  __vue_styles__,\n' +
    '  __vue_scopeId__,\n' +
    '  __vue_module_identifier__\n' +
    (isShadowMode ? `,true` : ``) +
    ')\n'

  // development-only code
  if (!isProduction) {
    // add filename in dev
    output +=
      'Component.options.__file = ' + JSON.stringify(shortFilePath) + '\n'
  }

  // add requires for customBlocks
  if (parts.customBlocks && parts.customBlocks.length) {
    let addedPrefix = false

    parts.customBlocks.forEach((customBlock, i) => {
      if (loaders[customBlock.type]) {
        // require customBlock
        customBlock.src = customBlock.attrs.src
        const requireString = customBlock.src
          ? getRequireForSrc(customBlock.type, customBlock)
          : getRequire(customBlock.type, customBlock, i)

        if (!addedPrefix) {
          output += '\n/* customBlocks */\n'
          addedPrefix = true
        }

        output +=
          'var customBlock = ' + requireString + '\n' +
          'if (customBlock && customBlock.__esModule) {\n' +
          '  customBlock = customBlock.default\n' +
          '}\n' +
          'if (typeof customBlock === "function") {\n' +
          '  customBlock(Component)\n' +
          '}\n'
      }
    })
    output += '\n'
  }

  // hot reload
  if (needsHotReload) {
    output +=
      '\n/* hot reload */\n' +
      'if (module.hot) {(function () {\n' +
      '  var hotAPI = require("' + hotReloadAPIPath + '")\n' +
      '  hotAPI.install(require("vue"), false)\n' +
      '  if (!hotAPI.compatible) return\n' +
      '  module.hot.accept()\n' +
      '  if (!module.hot.data) {\n' +
      // initial insert
      '    hotAPI.createRecord("' + moduleId + '", Component.options)\n' +
      '  } else {\n'
    // update
    if (cssModules) {
      output +=
        '    if (module.hot.data.cssModules && Object.keys(module.hot.data.cssModules) !== Object.keys(cssModules)) {\n' +
        '      delete Component.options._Ctor\n' +
        '    }\n'
    }
    output +=
      `    hotAPI.${
        hasFunctionalTemplate ? 'rerender' : 'reload'
      }("${moduleId}", Component.options)\n  }\n`
    // dispose
    output +=
      '  module.hot.dispose(function (data) {\n' +
      (cssModules ? '    data.cssModules = cssModules\n' : '') +
      '    disposed = true\n' +
      '  })\n'
    output += '})()}\n'
  }

  // final export
  output += '\nexport default Component.exports\n'

  // done
  return output
}
