const normalize = require('../../../src/utils/normalize.js');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

describe('normalize.js',function(){
  it('test dep function:process.env.VUE_LOADER_TEST=true',function(){
    process.env.VUE_LOADER_TEST = true;
    let dep = 'test-dep'
    let result = normalize.dep(dep);
    expect(result).to.be.equal(dep);
  });
  it('test dep function:process.env.VUE_LOADER_TEST=fasle',function(){
    process.env.VUE_LOADER_TEST = false;
    let dep = 'test-dep'
    let result = normalize.dep(dep);
    expect(result).to.be.equal(dep);
  });
})


