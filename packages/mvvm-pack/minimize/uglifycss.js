let csso = require('csso');

module.exports = function(content, filePath) {
  let result = csso.minify(content, {});
  return result.css;
}