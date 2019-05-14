const {getCode} = require('../lib/check.js');
const expect = require('chai').expect;

let code = `
interface Interface1Interface {
  getMsg(msg: String): String;
}
class Method implements Interface1Interface {
  getMsg(msg) {
    return 'web:' + msg;
  }
}

export default new Method();
`

let result = getCode(code,{
  cmlType: 'wx',
  filePath: '/user/name.cml',
  enableTypes: []
})

describe('check.js wx', function() {
  it('getCode', function() {
    expect(!!~result.indexOf('export default __OBJECT__WRAPPER__')).to.be.equal(true);
  })
})


let result2 = getCode(code,{
  cmlType: 'weex',
  filePath: '/user/name.cml',
  enableTypes: []
})

describe('check.js weex', function() {
  it('getCode', function() {
    expect(!!~result2.indexOf('export default __OBJECT__WRAPPER__')).to.be.equal(true);
  })
})
