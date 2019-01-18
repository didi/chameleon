const esprima = require('esprima')

exports.parseAst = (function () {
  const _cached = {}
  return function (val) {
    let statement = 'a = '
    if (typeof val === 'object') {
      statement += `${JSON.stringify(val)}`
    }
    else {
      statement += val
    }
    const cached = _cached[statement]
    if (cached) {
      return cached
    }
    const ast = esprima.parse(statement)
      .body[0].expression.right
    _cached[statement] = ast
    return ast
  }
})()
