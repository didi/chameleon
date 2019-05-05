
const _ = require('../index.js');
const path = require('path');
var expect = require('chai').expect;

describe('mvvm-style-loader', function() {
  it('assets image url', function() {
    let loaderContext = {
      _module: {},
      resourcePath: path.join(__dirname,'index.js')
    }

    let content = `
      .class1 {
        color: red;
        background: url('./1.png');
      }
    `
    let output = _.call(loaderContext, content);
    expect(!!~output.indexOf(path.join(__dirname,'1.png'))).to.be.equal(true);
    expect(loaderContext._module._nodeType).to.be.equal('module');
    expect(loaderContext._module._moduleType).to.be.equal('style');
    expect(!!~loaderContext._module._cmlSource.indexOf(`__cml${path.join(__dirname,'1.png')}__lmc`)).to.be.equal(true);

  })


  it('assets inline image url', function() {
    let loaderContext = {
      _module: {},
      resourcePath: path.join(__dirname,'index.js')
    }

    let content = `
      .class1 {
        color: red;
        background: url('./1.png?__inline');
      }
    `
    let output = _.call(loaderContext, content);
    console.log(output)
    console.log(loaderContext._module)
    expect(!!~output.indexOf(path.join(__dirname,'1.png'))).to.be.equal(true);
    expect(loaderContext._module._nodeType).to.be.equal('module');
    expect(loaderContext._module._moduleType).to.be.equal('style');
    expect(!!~loaderContext._module._cmlSource.indexOf(`__cml${path.join(__dirname,'1.png?__inline')}__lmc`)).to.be.equal(true);

  })

  it('assets not file image url', function() {
    let loaderContext = {
      _module: {},
      resourcePath: path.join(__dirname,'index.js')
    }

    let content = `
      .class1 {
        color: red;
        background: url('./2.png');
      }
    `
    let output = _.call(loaderContext, content);
    console.log(output)
    console.log(loaderContext._module)
    expect(loaderContext._module._nodeType).to.be.equal('module');
    expect(loaderContext._module._moduleType).to.be.equal('style');
    expect(!!~loaderContext._module._cmlSource.indexOf(`background: url("./2.png")`)).to.be.equal(true);

  })
})