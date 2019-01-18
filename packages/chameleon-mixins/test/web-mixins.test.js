const mixins = require('../web-mixins.js').mixins.methods;
const {expect} = require('chai');

describe('web-mixins.js',function(){
  it('test styleProxyName function:aimed to transform cssStyle object to cssStyle string',function(){
    expect(mixins.$cmlStyle('width:100px;')).to.be.equal('width:100px;')
    expect(mixins.$cmlStyle({width:'100px'})).to.be.equal('width:100px;')
  });

})