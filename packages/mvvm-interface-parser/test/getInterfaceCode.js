
const getInterfaceCode = require('../lib/getInterfaceCode.js');
const path = require('path');
const fs = require('fs');
const interfacePath = path.join(__dirname, './lib/components/second/second.interface');
const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'})
let result1 = getInterfaceCode({interfacePath, content});
