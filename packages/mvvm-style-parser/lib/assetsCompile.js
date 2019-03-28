const postcss = require('postcss');

module.exports = function({source, filePath, compiler}) {
  let deps = [];
  const assetsPlugin = postcss.plugin('postcss-assets-plugin', function(options) {
    return (root, result) => {
      root.walkDecls((decl, i) => {
        if (~decl.value.indexOf('url')) {
          decl.value = decl.value.replace(/url\s*\(\s*[\'\"]?(.+?)[\'\"]?\s*\)/g, function(all, $1) {
            let realDependPath = compiler.resolve(filePath, $1);
            deps.push(realDependPath);
            let publicPath = compiler.getPublicPath(realDependPath);
            return publicPath;
          })
        }
      })
    }
  })

  return {
    source: postcss([assetsPlugin]).process(source).css,
    deps
  }
}

