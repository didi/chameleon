const postcss = require('postcss');
const path = require('path');
const { getExportFileName } = require('./utils');
const fs = require('fs');

module.exports = postcss.plugin('postcss-export', function(opts) {
  return function(root, result) {
    emitCss(root, result.opts);
  }
})

function emitCss(root, options) {
  let { file, webpack } = options;
  root.walkAtRules(rule => {
    // slice去掉""
    if (rule.name === "import") {
      let resourcePath = path.resolve(file.dirname, rule.params.slice(1, -1));
      let exportFileName = getExportFileName(resourcePath, webpack.options);
      let content = fs.readFileSync(resourcePath);
      webpack.emitFile(exportFileName, content);
      // 递归依赖
      let cRoot = postcss.parse(content, {});
      emitCss(cRoot, {
        file: {
          extname: path.extname(resourcePath),
          dirname: path.dirname(resourcePath),
          basename: path.basename(resourcePath)
        },
        webpack
      })
    }
  })
}
