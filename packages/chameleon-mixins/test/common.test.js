const common = require('../common.js');
const {expect} = require('chai');


describe('common.js', function() {
  it('test merge source to target', function() {
    let target = {name: 'jim', age: 12};
    let source = {name: 'jhon', address: 'China'};
    let result = common.merge(target, source);
    expect(target).to.be.deep.equal({ name: 'jhon', age: 12, address: 'China' })
  });
  it('test isType function', function() {
    let str = 'this is string';
    let bool = true;
    let obj = {};
    let arr = [];
    let date = new Date();
    let promise = new Promise(() => {});
    let reg = /this is reg/g;
    let fun = () => {};
    expect(common.isType(str, 'String')).to.be.ok;
    expect(common.isType(bool, 'Boolean')).to.be.ok;
    expect(common.isType(obj, 'Object')).to.be.ok;
    expect(common.isType(arr, 'Array')).to.be.ok;
    expect(common.isType(date, 'Date')).to.be.ok;
    expect(common.isType(promise, 'Promise')).to.be.ok;
    expect(common.isType(reg, 'RegExp')).to.be.ok;
    expect(common.isType(fun, 'Function')).to.be.ok;
    expect(common.isType(str, 'String')).to.be.ok;
  });
  it('test mergeStyle function', function() {
    let cssString = 'background-color:red; width:100px; ';
    let cssObj1 = {height: '200px;', 'font-size': '30px'};
    let cssObj2 = {color: 'red'};
    let mergeResult = common.mergeStyle(cssString, cssObj1, cssObj2);
    expect(mergeResult).to.be.equal(`background-color:red;width:100px;height:200px;;font-size:30px;color:red;`);
  });
  it('judge if the arguments is reactive', function() {
    expect(common.isReactive(`'index'`)).to.be.an('array')
  });
  it('test trim function', function() {
    expect(common.trim('  name   ')).to.be.equal('name');
  })

})
