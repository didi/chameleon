

const _ = require('../runtime/copyProto.js');
const expect = require('chai').expect;
class A {
  fun1() {
    console.log('fun1')
  }
}

describe('mvvm-interface-parser/getMethodCode', function() {
  it('copyProto.js', function() {
    var obj = new A();
    _(obj);
    expect(obj.hasOwnProperty('fun1'))
  })

})

