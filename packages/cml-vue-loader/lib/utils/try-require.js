const cwd = process.cwd()
const resolve = require('resolve')

// attempts to first require a dep using projects cwd (when vue-loader is linked)
// then try a normal require.
module.exports = function tryRequire (dep) {
  let fromCwd
  try {
    fromCwd = resolve.sync(dep, { basedir: cwd })
  } catch (e) {}
  if (fromCwd) {
    return require(fromCwd)
  } else {
    try {
      return require(dep)
    } catch (e) {}
  }
}
