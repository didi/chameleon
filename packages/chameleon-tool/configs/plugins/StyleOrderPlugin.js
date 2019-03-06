
class StyleOrderPlugin {
  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.emit.tap('StyleOrderPlugin', reverseCssOrder);
    } else {
      compiler.plugin('emit', reverseCssOrder);
    }

    function reverseCssOrder(compilation, callback) {
      Object.keys(compilation.assets).forEach(fileName => {
        if (/\.css$/.test(fileName)) {
          if (compilation.assets[fileName] && compilation.assets[fileName].children && compilation.assets[fileName].children.length) {
            compilation.assets[fileName].children = compilation.assets[fileName].children.reverse()
          }
        }
      })
      callback()
    }

  }
}

module.exports = StyleOrderPlugin;


