var IS_TEST = !!process.env.VUE_LOADER_TEST
var fs = require('fs')
var path = require('path')

// var hasWeexLoader = false
// try {
//   hasWeexLoader = !!require('weex-loader')
// } catch (e) {}

exports.lib = function (file) {
  if (IS_TEST) {
    return path.resolve(__dirname, file)
  }
  if (fs.existsSync(path.resolve('.', 'node_modules', 'weex-loader', 'node_modules', 'weex-vue-loader'))) {
    return 'weex-loader/node_modules/weex-vue-loader/lib/' + file
  }
  return path.resolve(__dirname, file)
}

exports.dep = function (dep) {
  if (IS_TEST) {
    return dep
  } else if (fs.existsSync(path.resolve(__dirname, '../node_modules', dep))) {
    // npm 2 or npm linked
    var res = fs.existsSync('weex-loader/node_modules/weex-vue-loader/node_modules/' + dep)
      ? ('weex-loader/node_modules/weex-vue-loader/node_modules/' + dep)
      : ('weex-loader/node_modules/' + dep)
    return res
  } else {
    // npm 3
    return dep
  }
}
