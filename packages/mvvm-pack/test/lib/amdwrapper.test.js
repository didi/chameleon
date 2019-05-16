let wrapper = require('../../lib/amdwrapper');
const expect = require('chai').expect;

describe('amdwrapper', function() {
  it('not has cmldefine', function() {
    let code = 'sdfsdfsdfsdfd'
    let result = wrapper({content: code, modId: '123'})
    expect(result).to.be.equal('\ncmldefine(\'123\', function(require, exports, module) {\n  sdfsdfsdfsdfd\n})')
  })
  it('has cmldefine', function() {
    let code = '\ncmldefine(\'123\', function(require, exports, module) {\n  sdfsdfsdfsdfd\n})';
    let result = wrapper({content: code, modId: '123'})
    expect(result).to.be.equal(code)
  })
})

