
let _ = require('../../lib/amd.js');
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;

describe('amd', function() {
  it('amdWrapModule not has cmldefine', function() {
    let code = 'sdfsdfsdfsdfd'
    let result = _.amdWrapModule({content: code, modId: '123'})
    expect(result).to.be.equal('\ncmldefine(\'123\', function(require, exports, module) {\n  sdfsdfsdfsdfd\n})')
  })
  it('amdWrapModule has cmldefine', function() {
    let code = '\ncmldefine(\'123\', function(require, exports, module) {\n  sdfsdfsdfsdfd\n})';
    let result = _.amdWrapModule({content: code, modId: '123'})
    expect(result).to.be.equal(code)
  })


  it('getModuleBootstrap', function() {
    let amdCode = fs.readFileSync(path.join(__dirname, '../../lib/amdbootstrap.module.js'), {encoding: 'utf8'})

    let result = _.getModuleBootstrap()
    expect(result).to.be.equal(amdCode)
  })

  it('getGlobalBootstrap', function() {
    let result = _.getGlobalBootstrap('global')
    expect(!!~result.indexOf('(global)')).to.be.equal(true)
  })
})

