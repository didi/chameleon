
let amd = require('../../lib/amdbootstrap.module.js')
const expect = require('chai').expect;

describe('amdbootstrap.moudle.js', function() {
  it('module cmldefine', function() {

    amd.cmldefine('name', function(require, exports, module) {
      global.unittest = '123';
    })
    amd.cmlrequire('name');
    amd.cmlrequire('name');

    expect(global.unittest).to.be.equal('123');

  })

  it('module not find', function() {

    amd.cmldefine('name', function(require, exports, module) {
      global.unittest = '123';
    })
    try {
      amd.cmlrequire('name2');
    } catch (e) {
      expect(!!~e.message.indexOf('[ModJS] Cannot find module')).to.be.equal(true);
    }
  })

  it('module has return', function() {

    amd.cmldefine('name3', function(require, exports, module) {
      return 'has return';
    })
    var value = amd.cmlrequire('name3');
    expect(!!~value.indexOf('has return')).to.be.equal(true);
  })
})

