
const fs = require('fs');
const path = require('path');

module.exports = function getRunTimeSnippet(platform, type) {
  return fs.readFileSync(path.join(__dirname, `./${type}.js`))
}
