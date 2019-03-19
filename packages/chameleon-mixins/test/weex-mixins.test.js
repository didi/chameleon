const mixins = require('../weex-mixins.js').mixins.methods;
const {expect} = require('chai');

describe('weex-mixins.js', function() {
  it('test styleProxyName function:aimed to transform cssStyle string to cssStyle Object', function() {
    expect(mixins._cmlStyleProxy('width:75px; ;height:50px; ')).to.be.deep.equal({ width: '75px', height: '50px' });
    expect(mixins._cmlStyleProxy({ width: '75px', height: '50px' })).to.be.deep.equal({ width: '75px', height: '50px' });
  });
  it('test $cmlMergeStyle function', function() {
    let cssString = 'background-color:red; width:100px; ';
    let cssObj1 = {height: '200px;', 'font-size': '30px'};
    let cssObj2 = {color: 'red'};
    let mergeResult = mixins.$cmlMergeStyle(cssString, cssObj1, cssObj2);
    expect(mergeResult).to.be.equal(`background-color:red;width:100px;height:200px;;font-size:30px;color:red;`);
  });
  it('test weexClassProxy array function', function() {
    let result = mixins._weexClassProxy(['str1', 'str2']);
    expect(result).to.include('str1')
    expect(result).to.include('str2')
  });
  it('test weexClassProxy array function', function() {
    let result = mixins._weexClassProxy({str1: 'str1', str2: 'str2'});
    expect(result).to.include('str1')
    expect(result).to.include('str2')
  });

})
