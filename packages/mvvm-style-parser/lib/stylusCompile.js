
const stylus = require('stylus');
const path = require('path');

module.exports = function({source, filePath}) {
  // todo 给less options 添加plugin  addFileManager 参见less-loader  createWebpackLessPlugin.js
  return new Promise(function(resolve, reject) {
    let styl = stylus(output);
    styl.set('filename', filePath);
    styl.set('paths', [path.dirname(filePath)]);
    let imports = styl.deps();
    stylus.render(function(err, css) {
      if (err) {
        reject(err);
      }
      resolve({
        imports,
        css
      });
    })

  })
}
