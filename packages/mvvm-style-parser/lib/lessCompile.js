
const less = require('less');

module.exports = function({source, filePath}) {
  // todo 给less options 添加plugin  addFileManager 参见less-loader  createWebpackLessPlugin.js
  return less.render(source, {
    compress: false,
    filename: filePath,
    relativeUrls: true,
    sourceMap: false
  })
}
