const parseCss = require('../../parser/weex.js');
const expect = require('chai').expect;

let source = `body {width:75cpx;border:1cpx solid red;}`;


describe('parse/weex', function() {
  it('if options.rem to be truthy ,parse px to rem,else multiply the px value by options.scale', function() {

    let result = parseCss(source);// body {width:1rem;}
    console.log(result);
    expect(/border\-style/.test(result)).to.be.ok;
    expect(/border\-width/.test(result)).to.be.ok;
    expect(/border\-color/.test(result)).to.be.ok;
    expect(/75px/.test(result)).to.be.ok;
  })

})


