
const postcss = require('postcss');
const cmlUtils = require('chameleon-tool-utils');

exports.assets = function({source, loaderContext}) {
  let resourcePath = loaderContext.resourcePath;
  let deps = [];
  const assetsPlugin = postcss.plugin('postcss-assets-plugin', function(options) {
    return (root, result) => {
      root.walkDecls((decl, i) => {
        if (~decl.value.indexOf('url')) {
          decl.value = decl.value.replace(/url\s*\(\s*[\'\"]?(.+?)[\'\"]?\s*\)/g, function(all, $1) {
            let splitUrl = $1.split('?');
            let realDependPath = cmlUtils.resolveSync(resourcePath, splitUrl[0]);
            if(realDependPath && cmlUtils.isFile(realDependPath)) {
              if(splitUrl[1]) {
                realDependPath = realDependPath + '?' + splitUrl[1];
              }
              deps.push(realDependPath);
              return `__cml${realDependPath}__lmc`;
            } else {
              return $1;
            }
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