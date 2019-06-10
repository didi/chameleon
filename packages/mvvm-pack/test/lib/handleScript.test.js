
let _ = require('../../lib/handleScript.js');
const expect = require('chai').expect;

describe('handleScript.js', function() {
  it('handleScript', function() {
    let code = `
      import a from '../a.js';
      var b = require('../b.js');
      require('../c.js');
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
        }
      ]
    }
    let result = _.handleScript(code, target);
    console.log(result)
    expect(!!~result.indexOf('var b = require("b")')).to.be.equal(true);
    expect(!!~result.indexOf('import a from "a";')).to.be.equal(true);
    expect(!!~result.indexOf('require("c");')).to.be.equal(true);
  })

  it('no modId', function() {
    let code = `
      import a from '../a.js';
      var b = require('../b.js');
      require('../c.js');
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
        }
      ]
    }
    try {
      _.handleScript(code, target);
    }
    catch (e) {
    }
  })
})

