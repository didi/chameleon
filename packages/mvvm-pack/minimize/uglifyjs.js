let UglifyJS = require("uglify-js");
let cmlUtils = require('chameleon-tool-utils');

module.exports = function(code, filename, options = {}) {
  let result = UglifyJS.minify(code, Object.assign(options, {
    warnings: true
  }));
  if (result.error) {
    let errorMessage = `file uglify error： ${filename}\n`;
    Object.keys(result.error).forEach(key => {
      errorMessage += `${key}: ${result.error[key]}\n`
    })
    throw new Error(errorMessage);
  }

  if (result.warnings) {
    let errorMessage = `file uglify warning: ${filename}\n`;
    result.warnings.forEach(item => {
      errorMessage += `${item}\n`
    })
    cmlUtils.log.warn(errorMessage);
  }
  return result.code;
}
