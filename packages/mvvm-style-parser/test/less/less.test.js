
let lessCompile = require('../../lib/lessCompile');

var path = require('path');
var fs = require('fs');

let filePath = path.join(__dirname, './less1.less')
let source = fs.readFileSync(filePath, {encoding: 'utf8'});
debugger
lessCompile({
  source,
  filePath
}).then(res => {
  console.log(res)
})
