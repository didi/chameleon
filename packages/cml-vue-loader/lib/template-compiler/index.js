const prettier = require('prettier')
const loaderUtils = require('loader-utils')
const normalize = require('../utils/normalize')
const compiler = require('vue-template-compiler')
const { loadOptions } = require('../utils/options-cache')
const transpile = require('vue-template-es2015-compiler')
const hotReloadAPIPath = normalize.dep('vue-hot-reload-api')
const transformRequire = require('./modules/transform-require')
const transformSrcset = require('./modules/transform-srcset')

module.exports = function (html) {
  const isServer = this.target === 'node'
  const isProduction = this.minimize || process.env.NODE_ENV === 'production'
  const options = loaderUtils.getOptions(this) || {}
  const vueOptions = loadOptions(options.optionsId)
  const needsHotReload = !isServer && !isProduction && vueOptions.hotReload !== false
  const defaultModules = [transformRequire(vueOptions.transformToRequire), transformSrcset()]

  const compilerOptions = {
    preserveWhitespace: vueOptions.preserveWhitespace,
    modules: defaultModules.concat(vueOptions.compilerModules || []),
    directives: vueOptions.compilerDirectives || {},
    scopeId: options.hasScoped ? options.id : null,
    comments: options.hasComment
  }

  const compile =
    isServer && compiler.ssrCompile && vueOptions.optimizeSSR !== false
      ? compiler.ssrCompile
      : compiler.compile

  const compiled = compile(html, compilerOptions)

  // tips
  if (compiled.tips && compiled.tips.length) {
    compiled.tips.forEach(tip => {
      this.emitWarning(tip)
    })
  }

  let code
  if (compiled.errors && compiled.errors.length) {
    this.emitError(
      `\n  Error compiling template:\n${pad(html)}\n` +
        compiled.errors.map(e => `  - ${e}`).join('\n') +
        '\n'
    )
    code =
      `export var render = function () {}\n` +
      `export var staticRenderFns = []`
  } else {
    const bubleOptions = options.buble
    const stripWith = bubleOptions.transforms.stripWith !== false
    const stripWithFunctional = bubleOptions.transforms.stripWithFunctional

    const staticRenderFns = compiled.staticRenderFns.map(fn =>
      toFunction(fn, stripWithFunctional)
    )

    code =
      transpile(
        'var render = ' +
          toFunction(compiled.render, stripWithFunctional) +
          '\n' +
          'var staticRenderFns = [' +
          staticRenderFns.join(',') +
          ']',
        bubleOptions
      ) + '\n'

    // prettify render fn
    if (!isProduction) {
      code = prettier.format(code, { semi: false, parser: 'babylon' })
    }

    // mark with stripped (this enables Vue to use correct runtime proxy detection)
    if (!isProduction && stripWith) {
      code += `render._withStripped = true\n`
    }
    code += `export { render, staticRenderFns }`
  }
  // hot-reload
  if (needsHotReload) {
    code +=
      '\nif (module.hot) {\n' +
      '  module.hot.accept()\n' +
      '  if (module.hot.data) {\n' +
      '    require("' + hotReloadAPIPath + '")' +
      '      .rerender("' + options.id + '", { render: render, staticRenderFns: staticRenderFns })\n' +
      '  }\n' +
      '}'
  }

  return code
}

function toFunction (code, stripWithFunctional) {
  return (
    'function (' + (stripWithFunctional ? '_h,_vm' : '') + ') {' + code + '}'
  )
}

function pad (html) {
  return html
    .split(/\r?\n/)
    .map(line => `  ${line}`)
    .join('\n')
}
