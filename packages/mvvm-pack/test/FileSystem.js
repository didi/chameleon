
const Compile = require('../lib/Compile.js');
const path = require('path');

let compile = new Compile({
  config: {},
  cmlRoot: path.resolve('./'),
  projectRoot: path.resolve('./')
})

const filePath = path.resolve('./ResolveFactory.test.js')
const result = compile.readFileSync(filePath);
