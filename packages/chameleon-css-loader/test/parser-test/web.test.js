const parseCss = require('../../parser/web.js');
const expect = require('chai').expect;

let source = `body {width:75cpx; height: 1px}`;
let source2 = `width:75cpx; height: 1px;`;


describe('parse/web', function() {
  it('web-cssStyle:if options.rem to be truthy ,parse px to rem,else multiply the px value by options.scale', function() {
    let options1 = {
      rem: true,
      scale: 0.5,
      remOptions: {
        // base on 750px standard.
        rootValue: {cpx: 75}

      }
    }
    let options2 = {
      rem: false,
      scale: 0.5,
      remOptions: {
        // base on 750px standard.
        rootValue: {cpx: 75}
      }
    }
    let result1 = parseCss(source, options1);
    let result2 = parseCss(source, options2);
    expect(result1).to.equal('body {width:1rem; height: 1px}');
    expect(result2).to.equal('body {width:37.5px; height: 1px}')

    let result3 = parseCss(source2, options1);
    expect(result3).to.equal('width:1rem; height: 1px;');

    let result4 = parseCss(source2, options2);
    expect(result4).to.equal('width:37.5px; height: 1px;')


  })
})


