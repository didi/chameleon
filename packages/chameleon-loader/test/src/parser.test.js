const parser = require('../../src/parser.js');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

let source = fs.readFileSync(path.resolve(__dirname,'./parser.cml'),'utf-8');
describe('parser.js',function(){
  it('test parser',function(){
    let result = parser(source);
    expect(result.template.length).to.equal(1);
    expect(result.script.length).to.equal(2);
    expect(result.style.length).to.equal(1);
  })
})


