const IS_TEST = !!process.env.VUE_LOADER_TEST
const fs = require('fs')
const path = require('path')

exports.lib = file => path.resolve(__dirname, '../', file)

exports.dep = dep => {
  if (IS_TEST) {
    return dep
  } else if (
    fs.existsSync(path.resolve(__dirname, '../../node_modules', dep))
  ) {
    // npm 2 or npm linked
    return 'vue-loader/node_modules/' + dep
  } else {
    // npm 3
    return dep
  }
}
