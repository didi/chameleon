const Utils = require('../lib/Helper.js/index.js');

let content = '3333333';
content = new Buffer(content, 'utf-8')
console.log(content)
let result = Utils.createMd5(content);
console.log(result)
