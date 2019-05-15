
const _ = require('../minimize/uglifyjs.js');
const expect = require('chai').expect;

describe('uglifyjs', function() {
  it('normal', function() {
    let code = `
    function f(){ console.log('a') }
    `;
    let result = _(code, '1.js');
    expect(result).to.be.equal('function f(){console.log("a")}')
  })
  it('warnings', function() {
    let code = `
    function f(){ var u; return 2 + 3; }
    `;
    let result = _(code, '1.js');
    expect(result).to.be.equal('function f(){return 5}')
  })
  it('error', function() {
    let code = `
    function (){ var u; return 2 + 3; }
    `;
    try {
      _(code, '1.js');
    } catch (e) {
      expect(!!~e.message.indexOf('message: Unexpected token: punc «(», expected: name')).to.be.equal(true)
    }
  })

  it('not has ;', function() {
    let commonjsContent = `var manifest = require('./manifest.js')\n`;
    commonjsContent += `var cmldefine = manifest.cmldefine;\n`;
    let result = _(commonjsContent, '2.js');
    expect(result).to.be.equal('var manifest=require("./manifest.js"),cmldefine=manifest.cmldefine;')


  })
})

