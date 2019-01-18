const try_require = require('../../../src/utils/try-require.js');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

describe('try_require.js',function(){
  it('test try require',function(){
    let result = !!try_require('@babel/parser');
    expect(result).to.be.ok
  })
})


