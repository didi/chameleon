const parseCss = require('../../transform/weex.js');
const expect = require('chai').expect;
let source = `width:75cpx;border:1cpx solid red;`;


describe('parse/weex', function() {
  it('if options.rem to be truthy ,parse px to rem,else multiply the px value by options.scale', function() {
    let result = parseCss.parse(source);// body {width:1rem;}
    console.log(result);
    expect(/75px/.test(result)).to.be.ok;
    expect(/1px/.test(result)).to.be.ok;
  })
})
