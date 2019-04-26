// this is a utility loader that takes a *.vue file, parses it and returns
// the requested language block, e.g. the content inside <template>, for
// further processing.

const path = require('path')
const parse = require('./parser')
const loaderUtils = require('loader-utils')

module.exports = function (content) {
  const query = loaderUtils.getOptions(this) || {}
  const context = (this._compiler && this._compiler.context) || this.options.context || process.cwd()
  let filename = path.basename(this.resourcePath)
  filename = filename.substring(0, filename.lastIndexOf(path.extname(filename))) + '.vue'
  const sourceRoot = path.dirname(path.relative(context, this.resourcePath))
  const parts = parse(content, filename, this.sourceMap, sourceRoot)
  let part = parts[query.type]
  if (Array.isArray(part)) {
    part = part[query.index]
  }
  this.callback(null, part.content, part.map)
}
