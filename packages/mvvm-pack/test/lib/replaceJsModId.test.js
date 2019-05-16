
let _ = require('../../lib/replaceJsModId.js');
const expect = require('chai').expect;

describe('replaceJsModId.js', function() {
  it('replaceJsModId', function() {
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
    let result = _.replaceJsModId(code, target);
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
      _.replaceJsModId(code, target);
    }
    catch (e) {
    }
  })
})

