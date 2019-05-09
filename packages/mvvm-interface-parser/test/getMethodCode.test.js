
const expect = require('chai').expect;
const getMethodCode = require('../lib/getMethodCode.js');
const path = require('path');
const fs = require('fs');
const cmlUtils = require('chameleon-tool-utils')
describe('mvvm-interface-parser/getMethodCode', function() {
  it('getMethodCode', function() {
    const interfacePath = path.join(__dirname, './lib/components/second/second.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'})
    let result1 = getMethodCode({interfacePath, content, cmlType: 'web', resolve: cmlUtils.resolveSync});
    let firstInterfacePath = path.join(__dirname, './lib/components/first/first.interface');
    expect(result1.contentFilePath).to.be.equal(firstInterfacePath)
    expect(!!~result1.devDeps.indexOf(firstInterfacePath)).to.be.equal(true)
    expect(!!~result1.content.indexOf('FirstInterface')).to.be.equal(true);
  })

  it('getMethodCode src', function() {
    const interfacePath = path.join(__dirname, './lib/components/third.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'})
    let result1 = getMethodCode({interfacePath, content, cmlType: 'weex', resolve: cmlUtils.resolveSync});
    let contentPath = path.join(__dirname, './lib/components/thirdmethod.js');
    expect(result1.contentFilePath).to.be.equal(contentPath)
    expect(!!~result1.devDeps.indexOf(contentPath)).to.be.equal(true)
    expect(!!~result1.content.indexOf('thirdmethods')).to.be.equal(true);
  })
})

