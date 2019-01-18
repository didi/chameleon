// @todo: support hot reload
// @tips: not support isServer
// @tips: not support img[src]
// @tips: not support vueOptions.transformToRequire
// @tips: not support vueOptions.preserveWhitespace

var compiler = require('weex-template-compiler')
var transpile = require('vue-template-es2015-compiler')
var loaderUtils = require('loader-utils')
var beautify = require('js-beautify').js_beautify
// var normalize = require('./normalize')
// var hotReloadAPIPath = normalize.dep('vue-hot-reload-api')

// // vue compiler module for using transforming `<tag>:<attribute>` to `require`
// var defaultTransformToRequire = {
//   img: 'src'
// }
// var transformToRequire = defaultTransformToRequire
// var defaultCompileOptions = {
//   modules: [{
//     postTransformNode (el) {
//       for (var tag in transformToRequire) {
//         if (el.tag === tag && el.attrs) {
//           var attributes = transformToRequire[tag]
//           if (typeof attributes === 'string') {
//             el.attrs.some(attr => rewrite(attr, attributes))
//           } else if (Array.isArray(attributes)) {
//             attributes.forEach(item => el.attrs.some(attr => rewrite(attr, item)))
//           }
//         }
//       }
//     }
//   }]
// }

// function rewrite (attr, name) {
//   if (attr.name === name) {
//     var value = attr.value
//     var isStatic = value.charAt(0) === '"' && value.charAt(value.length - 1) === '"'
//     if (!isStatic) {
//       return
//     }
//     var firstChar = value.charAt(1)
//     if (firstChar === '.' || firstChar === '~') {
//       if (firstChar === '~') {
//         value = '"' + value.slice(2)
//       }
//       attr.value = `require(${value})`
//     }
//     return true
//   }
// }

module.exports = function (html) {
  // console.log(html);
  this.cacheable()
  var isProduction = this.minimize || process.env.NODE_ENV === 'production'
  var query = loaderUtils.getOptions(this) || {}
  // var isServer = (this.options || this._compiler.options).target === 'node'
  // var isServer = false
  var vueOptions = (this.options || this._compiler.options).__vueOptions__
  // if (vueOptions.transformToRequire) {
  //   transformToRequire = Object.assign(
  //     {},
  //     defaultTransformToRequire,
  //     vueOptions.transformToRequire
  //   )
  // }
  // var compiled = compiler.compile(html, Object.assign({
  //   preserveWhitespace: vueOptions.preserveWhitespace
  // }, defaultCompileOptions))
  var compiled = compiler.compile(html, {
    recyclable: query.recyclable
  })
  var code
  if (compiled.errors.length) {
    var self = this
    compiled.errors.forEach(function (err) {
      self.emitError('template syntax error ' + err)
    })
    code = 'module.exports={render:function(){},staticRenderFns:[]}'
  } else {
    var bubleOptions = vueOptions.buble
    code = transpile('module.exports={' +
      'render:' + toFunction(compiled.render) + ',' +
      (compiled['@render'] ? ('"@render":' + toFunction(compiled['@render']) + ',') : '') +
      'staticRenderFns: [' + compiled.staticRenderFns.map(toFunction).join(',') + ']' +
    '}', bubleOptions)
    // mark with stripped (this enables Vue to use correct runtime proxy detection)
    if (!isProduction && (
      !bubleOptions ||
      !bubleOptions.transforms ||
      bubleOptions.transforms.stripWith !== false
    )) {
      code += `\nmodule.exports.render._withStripped = true`
    }
  }
  // hot-reload
  // if (!isServer &&
  //     !this.minimize &&
  //     process.env.NODE_ENV !== 'production') {
  //   code +=
  //     '\nif (module.hot) {\n' +
  //     '  module.hot.accept()\n' +
  //     '  if (module.hot.data) {\n' +
  //     '     require("' + hotReloadAPIPath + '").rerender("' + query.id + '", module.exports)\n' +
  //     '  }\n' +
  //     '}'
  // }
  return code
}

function toFunction (code) {
  return 'function (){' + beautify(code, { indent_size: 2 }) + '}'
}
