
let _ = require('../../lib/handleScript.js');
const cmlUtils = require('chameleon-tool-utils');
global.cml = {
  log: cmlUtils.log
}
let code = `
  var b = require('../b.js');
`
var target = {
  dependencies: [
    {
      request: '../a.js',
      module: {
        request: '../a.js',
        id: 'a'
      }
    },
    {
      request: '../b.js',
      module: {
        request: '../b.js',
        id: 'b'
      }
    },
    {
      request: '../c.js',
      module: {
        request: '../c.js',
        id: 'c'
      }
    },
    {
      request: '../d.js',
      module: {
        request: '../d.js',
        id: 'd'
      }
    },
    {
      request: './src/interfaces/alert/index.js',
      module: {
        request: '../d.js',
        id: 'index'
      }
    }
  ]
}
let result = _.handleScript(code, target, {});
console.log(result)