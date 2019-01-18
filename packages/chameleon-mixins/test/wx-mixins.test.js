const mixins = require('../wx-mixins.js').mixins.methods;
const {expect} = require('chai');

describe('wx-mixins.js',function(){
  it('test styleProxyName function:aimed to transfrom px to rpx',function(){
    console.log(mixins.$cmlStyle('width:75px;height:50px;'))
    console.log(mixins.$cmlStyle({ width: '75px', height: '50px' }))
    expect(mixins.$cmlStyle('width:75cpx;height:50cpx;')).to.be.equal(`width:75rpx;height:50rpx`);
    expect(mixins.$cmlStyle({ width: '75cpx', height: '50cpx' })).to.be.equal(`width:75rpx;height:50rpx`);
  });

})