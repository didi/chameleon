// utility for generating a uid for each component file
// used in scoped CSS rewriting
var hash = require('hash-sum')
var cache = Object.create(null)

module.exports = function genId (file) {
  return cache[file] || (cache[file] = hash(file))
}
