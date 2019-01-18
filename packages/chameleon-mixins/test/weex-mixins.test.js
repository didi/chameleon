const mixins = require('../weex-mixins.js').mixins.methods;
const {expect} = require('chai');

describe('weex-mixins.js',function(){
  it('test styleProxyName function:aimed to transform cssStyle string to cssStyle Object',function(){
    expect(mixins._cmlStyleProxy('width:75px; ;height:50px; ')).to.be.deep.equal({ width: '75px', height: '50px' });
    expect(mixins._cmlStyleProxy({ width: '75px', height: '50px' })).to.be.deep.equal({ width: '75px', height: '50px' });
  });

})