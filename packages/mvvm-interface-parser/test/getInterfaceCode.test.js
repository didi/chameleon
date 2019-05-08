
const expect = require('chai').expect;

const getInterfaceCode = require('../lib/getInterfaceCode.js');
const path = require('path');
const fs = require('fs');

describe('mvvm-interface-parser/getInterfaceCode', function() {
  it('getInterfaceCode', function() {
    const interfacePath = path.join(__dirname, './lib/components/second/second.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'})
    let result1 = getInterfaceCode({interfacePath, content});
    let firstInterfacePath = path.join(__dirname, './lib/components/first/first.interface')
    expect(result1.content).to.be.equal('\ninterface FirstInterface {\n  getMsg(msg: String): String;\n}\n\n')
    expect(result1.contentFilePath).to.be.equal(firstInterfacePath)
    expect(!!~result1.devDeps.indexOf(firstInterfacePath)).to.be.equal(true)
  })

  it('getInterfaceCode src', function() {
    const interfacePath = path.join(__dirname, './lib/components/third.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'})
    let result1 = getInterfaceCode({interfacePath, content});
    let contentPath = path.join(__dirname, './lib/components/thirdinterface.js')
    expect(result1.contentFilePath).to.be.equal(contentPath)
    expect(!!~result1.devDeps.indexOf(contentPath)).to.be.equal(true)
    console.log(result1)
  })
})
