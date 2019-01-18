const div = require('./div')
const span = require('./span')

const cmpMaps = { div, span }

module.exports = {
  div: div.processDiv,
  span: span.processSpan,
  // get ast compiler for binding styles.
  getCompiler: function (tag) {
    const cmp = cmpMaps[tag]
    const compile = cmp && cmp.compile
    return compile ? { compile } : undefined
  }
}
