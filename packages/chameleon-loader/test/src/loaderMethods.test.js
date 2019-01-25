const loaderMethods = require('../../src/loaderMethods.js');
const expect = require('chai').expect;
const path = require('path');

describe('prepareParseUsingComponents', function() {
  it('/npm/', function() {
    let originObj = {
      scroller: '/npm/cml-ui/scroller/scroller'
    }
    let loaderContext = {
      resourcePath: path.join(__dirname, './project/src/pages/page1.cml')
    }

    let context = path.join(__dirname, './project');
    let result = loaderMethods.prepareParseUsingComponents({
      loaderContext,
      context,
      originObj,
      cmlType: 'wx'
    });

    let expectPath = path.join(__dirname, './project/node_modules/cml-ui/scroller/scroller.cml')
    console.log(result)
    result.forEach(item => {
      if (item.tagName === 'scroller') {
        expect(item.filePath).to.be.equal(expectPath);
        expect(item.isNative).to.be.equal(false);
      }
    })
  })

  it('../npm/', function() {
    let originObj = {
      scroller: './../npm/cml-ui/scroller/scroller'
    }
    let loaderContext = {
      resourcePath: path.join(__dirname, './project/src/pages/page1.cml')
    }

    let context = path.join(__dirname, './project');
    let result = loaderMethods.prepareParseUsingComponents({
      loaderContext,
      context,
      originObj,
      cmlType: 'wx'
    });

    let expectPath = path.join(__dirname, './project/node_modules/cml-ui/scroller/scroller.cml')
    result.forEach(item=>{
      if (item.tagName === 'scroller') {
        expect(item.filePath).to.be.equal(expectPath);
        expect(item.isNative).to.be.equal(false);
      }
    })
  })
})


