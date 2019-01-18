var postcss = require('postcss')
var selectorParser = require('postcss-selector-parser')
var loaderUtils = require('loader-utils')

postcss.plugin('add-id', function (opts) {
  return function (root) {
    root.each(function rewriteSelector (node) {
      if (!node.selector) {
        // handle media queries
        if (node.type === 'atrule' && node.name === 'media') {
          node.each(rewriteSelector)
        }
        return
      }
      node.selector = selectorParser(function (selectors) {
        selectors.each(function (selector) {
          var node = null
          selector.each(function (n) {
            if (n.type !== 'pseudo') node = n
          })
          selector.insertAfter(node, selectorParser.attribute({
            attribute: opts.id
          }))
        })
      }).process(node.selector).result
    })
  }
})

var trim = postcss.plugin('trim', function (opts) {
  return function (css) {
    css.walk(function (node) {
      if (node.type === 'rule' || node.type === 'atrule') {
        node.raws.before = node.raws.after = '\n'
      }
    })
  }
})

module.exports = function (css, map) {
  this.cacheable()
  var cb = this.async()

  var query = loaderUtils.getOptions(this) || {}
  var options = (this.options || this._compiler.options).__vueOptions__
  var postcssOptions = options.postcss

  // postcss plugins
  var plugins
  if (Array.isArray(postcssOptions)) {
    plugins = postcssOptions
  } else if (typeof postcssOptions === 'function') {
    plugins = postcssOptions.call(this, this)
  } else if (isObject(postcssOptions) && postcssOptions.plugins) {
    plugins = postcssOptions.plugins
  }
  plugins = [trim].concat(plugins || [])

  // // scoped css
  // if (query.scoped) {
  //   plugins.push(addId({ id: query.id }))
  // }

  // postcss options, for source maps
  var file = this.resourcePath
  var opts
  opts = {
    from: file,
    to: file,
    map: false
  }
  if (
    this.sourceMap &&
    !this.minimize &&
    options.cssSourceMap !== false &&
    process.env.NODE_ENV !== 'production' &&
    !(isObject(postcssOptions) && postcssOptions.options && postcssOptions.map)
  ) {
    opts.map = {
      inline: false,
      annotation: false,
      prev: map
    }
  }

  // postcss options from configuration
  if (isObject(postcssOptions) && postcssOptions.options) {
    for (var option in postcssOptions.options) {
      if (!opts.hasOwnProperty(option)) {
        opts[option] = postcssOptions.options[option]
      }
    }
  }

  postcss(plugins)
    .process(css, opts)
    .then(function (result) {
      var map = result.map && result.map.toJSON()
    
      cb(null, result.css, map)
    })
    .catch(function (e) {
      console.log(e)
      console.log('eeeeeeee==============')
      cb(e)
    })
}

function isObject (val) {
  return val && typeof val === 'object'
}
