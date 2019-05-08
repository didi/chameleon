let csso = require('csso');

module.exports = function(content, filePath) {
  debugger
  let result = csso.minify(content, {});
  return result.css;
}