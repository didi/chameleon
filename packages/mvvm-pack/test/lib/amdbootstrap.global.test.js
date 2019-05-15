let fs = require('fs');
let path = require('path');
let code = fs.readFileSync(path.join(__dirname,'../../lib/amdbootstrap.global.js'),{encoding: 'utf8'})
const expect = require('chai').expect;



describe('amdbootstrap.global.js', function() {
  it('not has cmldefine', function() {
    
    code = `
    ${code.replace('$GLOBAL','global')}
    `
    eval(code)
    global.cmldefine('name', function(require, exports, module) {
      global.unittest = '123';
    })
    global.cmlrequire('name');

    expect(global.unittest).to.be.equal('123');

  })
})

