const mixins = require('../wx-alipay-common-mixins.js').mixins.methods;
const {expect} = require('chai');

describe('wx-mixins.js', function() {
  it('test styleProxyName function:aimed to transfrom px to rpx', function() {
    expect(mixins.$cmlStyle('width:75cpx;height:50cpx;')).to.be.equal(`width:75rpx;height:50rpx`);
    expect(mixins.$cmlStyle({ width: '75cpx', height: '50cpx' })).to.be.equal(`width:75rpx;height:50rpx`);
  });
  it('test $cmlMergeStyle function', function() {
    let cssString = 'background-color:red; width:100px; ';
    let cssObj1 = {height: '200px;', 'font-size': '30px'};
    let cssObj2 = {color: 'red'};
    let mergeResult = mixins.$cmlMergeStyle(cssString, cssObj1, cssObj2);
    expect(mergeResult).to.be.equal(`background-color:red;width:100px;height:200px;;font-size:30px;color:red;`);
  });

})
