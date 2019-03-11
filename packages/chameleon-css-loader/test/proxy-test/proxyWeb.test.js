const parseCss = require('../../proxy/proxyWeb.js');
const expect = require('chai').expect;

let source = `width:75cpx;font-size:26px;/* height:200px; */`;


describe('parse/web', function() {
  it('web-cssvalue : if options.rem to be truthy ,parse cpx to rem,else multiply the cpx value by options.scale', function() {
    let options1 = {
      rem: true,
      scale: 0.5,
      remOptions: {
        // base on 750px standard.
        rootValue: {cpx: 75},
        // to leave 1px alone.
        minPixelValue: 1.01
      }
    }
    let options2 = {
      rem: false,
      scale: 0.5,
      remOptions: {
        // base on 750px standard.
        rootValue: {cpx: 75},
        // to leave 1px alone.
        minPixelValue: 1.01
      }
    }
    let result1 = parseCss(source, options1);// body {width:1rem;}
    let result2 = parseCss(source, options2);// body {width:37.5px;}
    expect(/1rem/.test(result1)).to.be.ok;
    expect(/37.5px/.test(result2)).to.be.ok;
  })


  it('lines', function() {
    let result = parseCss('lines:1;');
    expect(result).to.equal('display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden');
  })
})


