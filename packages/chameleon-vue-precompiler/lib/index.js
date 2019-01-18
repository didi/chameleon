
const Precompiler = require('./precompiler')

/**
 * 
 * @param {Object} config 
 */
module.exports = function getPrecompiler (config) {
  const precompiler = new Precompiler(config)
  return precompiler.compile.bind(precompiler)
}
