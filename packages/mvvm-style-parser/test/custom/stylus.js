var path = require('path');
var fs = require('fs');
var stylus = require('stylus')

let source = fs.readFileSync(path.join(__dirname, './1.styl'), {encoding: 'utf8'});
let filename = path.join(__dirname, './1.styl');
let demo = stylus(source)
demo.set('filename', filename)
demo.set('paths', [path.dirname(filename)]);
let deps = demo.deps();
debugger
console.log(deps)
demo.render(function(err, css) {
  console.log(css)
})

