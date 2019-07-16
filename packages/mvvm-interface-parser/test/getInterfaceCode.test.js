
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
  })

  it('getInterfaceCode not has interface', function() {
    const interfacePath = path.join(__dirname, './lib/components/third/third.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'});
    try {
      getInterfaceCode({interfacePath, content});
    } catch (e) {
      expect(!!~e.message.indexOf(`not find <script cml-type='interface'></script>`)).to.be.equal(true)
    }
  })

  it('multi interface', function() {
    const interfacePath = path.join(__dirname, './lib/components/third/multi.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'});
    try {
      getInterfaceCode({interfacePath, content});
    } catch (e) {
      expect(!!~e.message.indexOf(`multi <script cml-type='interface'></script>`)).to.be.equal(true)
    }
  })

  it('not has src interface', function() {
    const interfacePath = path.join(__dirname, './lib/components/third/not.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'});
    try {
      getInterfaceCode({interfacePath, content});
    } catch (e) {
      expect(!!~e.message.indexOf(`not find file: `)).to.be.equal(true)
    }
  })

  it('mutli interface', function() {
    const interfacePath = path.join(__dirname, './lib/components/third/double.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'});
    try {
      getInterfaceCode({interfacePath, content});
    } catch (e) {
      expect(!!~e.message.indexOf(`multi <script cml-type='interface'></script> has define in `)).to.be.equal(true)
    }
  })

  it('include src error', function() {
    const interfacePath = path.join(__dirname, './lib/components/third/include1.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'});
    try {
      getInterfaceCode({interfacePath, content});
    } catch (e) {
      expect(!!~e.message.indexOf(`not define include src attribute in`)).to.be.equal(true)
    }
  })

  it('include src not file', function() {
    const interfacePath = path.join(__dirname, './lib/components/third/include2.interface');
    const content = fs.readFileSync(interfacePath, {encoding: 'utf-8'});
    try {
      getInterfaceCode({interfacePath, content});
    } catch (e) {
      expect(!!~e.message.indexOf(`not find file:`)).to.be.equal(true)
    }
  })
})
