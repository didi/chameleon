
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

  it('getDefines', function() {
    var defines = {
      'process.env.media': JSON.stringify('dev'),
      domain: {
        domain1: '"domain1"'
      },
      a: 'avalue',
    }

    var result = [];

    _.getDefines(defines, '', result);
    var expectresult = [ { key: [ 'process', 'env', 'media' ], value: '"dev"' },
    { key: [ 'domain', 'domain1' ], value: '"domain1"' },
    { key: [ 'a' ], value: 'avalue' } ]
    expect(result).to.deep.equal(expectresult);
  })

  it('replaceDefines', function() {

    let code = `
    if(CML) {

    }
    if(process.env.media == 'dev') {

    }
    let a = 'a';
    console.log(b.c);
    `
    let result = _.handleScript(code, {});
    console.log(result)
    // expect(result).to.deep.equal(expectresult);
  })
})

