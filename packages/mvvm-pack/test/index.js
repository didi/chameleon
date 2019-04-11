const path = require('path');
const fs = require('fs');
let result = path.join(__dirname, '2/1.js')
console.log(result)
console.log(__dirname)

fs.writeFileSync(result,'333')