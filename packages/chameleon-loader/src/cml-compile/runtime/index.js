
const fs = require('fs');
const path = require('path');
module.exports = {} = _;
_.getMiniAppRunTimeSnippet = function (platform, type) {
  return fs.readFileSync(path.join(__dirname, `./${type}.js`))
}
_.getVueRunTimeSnippet = function (platform, type) {
  return fs.readFileSync(path.join(__dirname, `./${platform}/${type}.js`))
}

