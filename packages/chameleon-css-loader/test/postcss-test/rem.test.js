const parseCss = require('../../postcss/rem.js');
const expect = require('chai').expect;

let source = `width:75cpx;font-size:26cpx;/* height:200cpx; */`;


describe('postcss/rem', function() {
  it('web-cssvalue : if options.rem to be truthy ,parse cpx to rem', function() {
    let options = {
      rem: true,
      scale: 0.5,
      remOptions: {
        // base on 750px standard.
        rootValue: {cpx: 75},
        // to leave 1px alone.
        minPixelValue: 1.01
      }
    }
    let result = parseCss(source, options);
    expect(/1rem/.test(result)).to.be.ok;
  })
})


