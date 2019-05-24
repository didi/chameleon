const mixins = require('../web-mixins.js').mixins.methods;
const {expect} = require('chai');

describe('web-mixins.js', function() {
  it('test styleProxyName function:aimed to transform cssStyle object to cssStyle string', function() {
    expect(mixins.$cmlStyle('width:100px;')).to.be.equal('width:100px;')
    expect(mixins.$cmlStyle({width: '100px'})).to.be.equal('width:100px;')
  });
  it('test $cmlMergeStyle function', function() {
    let cssString = 'background-color:red; width:100px; ';
    let cssObj1 = {height: '200px;', 'font-size': '30px'};
    let cssObj2 = {color: 'red'};
    let mergeResult = mixins.$cmlMergeStyle(cssString, cssObj1, cssObj2);
    expect(mergeResult).to.be.equal(`background-color:red;width:100px;height:200px;;font-size:30px;color:red;`);
  });

})
