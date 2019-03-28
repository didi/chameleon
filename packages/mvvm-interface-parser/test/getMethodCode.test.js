
const getMethodCode = require('../lib/getMethodCode.js');
const path = require('path');
const fs = require('fs');
const interfacePath = path.join(__dirname, './lib/components/second/second.interface');
const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'})
let result1 = getMethodCode({interfacePath, content, cmlType: 'web', resolve: function(filePath, relativePath) {
  return path.resolve(path.dirname(filePath), relativePath)
}});
console.log(result1.devDeps)
debugger
