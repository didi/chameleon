// loader for pre-processing templates with e.g. pug

const cons = require('consolidate')
const loaderUtils = require('loader-utils')
const { loadOptions } = require('../utils/options-cache')

module.exports = function (content) {
  const callback = this.async()
  const opt = loaderUtils.getOptions(this) || {}

  if (!cons[opt.engine]) {
    return callback(
      new Error(
        "Template engine '" +
          opt.engine +
          "' " +
          "isn't available in Consolidate.js"
      )
    )
  }

  // allow passing options to the template preprocessor via `template` option
  const vueOptions = loadOptions(opt.optionsId)
  if (vueOptions.template) {
    Object.assign(opt, vueOptions.template)
  }

  // for relative includes
  opt.filename = this.resourcePath

  cons[opt.engine].render(content, opt, (err, html) => {
    if (err) {
      return callback(err)
    }
    callback(null, html)
  })
}
