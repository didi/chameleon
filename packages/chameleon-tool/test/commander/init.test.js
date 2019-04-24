const initCommander = require('../../commanders/init/index.js');
const path = require('path');
const fs = require('fs');
var expect = require('chai').expect;
process.argv = ['node', 'chameleon.js'];
require('../../lib/index.js');

describe('init/index.js', function() {
  it('toUpperCase', function () {
    let uppername = 'demo-com';
    let result = initCommander.toUpperCase(uppername);
    expect(result).to.be.equal('DemoCom');
  })

  it('getIgnorePlatform no params', function () {
    cml.config.merge({
      platforms: ['web', 'weex', 'wx']
    })
    let result = initCommander.getIgnorePlatform();
    expect(!!~result.ignorePlatform.indexOf('alipay')).to.be.equal(true);
    expect(!!~result.ignorePlatform.indexOf('baidu')).to.be.equal(true);
  })

  it('getIgnorePlatform has params', function () {
    let result = initCommander.getIgnorePlatform(['web', 'weex']);
    expect(!!~result.ignorePlatform.indexOf('alipay')).to.be.equal(true);
    expect(!!~result.ignorePlatform.indexOf('baidu')).to.be.equal(true);
    expect(!!~result.ignorePlatform.indexOf('wx')).to.be.equal(true);
  })

  it('contentIgnoreHanle cml', function () {
    cml.config.merge({
      platforms: ['web', 'weex', 'wx']
    })
    let content = fs.readFileSync(path.join(__dirname, './index.cml'), {encoding: 'utf8'});
    let result = initCommander.contentIgnoreHanle(content, 'cml');
    let splitContent = cml.utils.getScriptPart({content: result, cmlType: 'json'});
    if (splitContent) {
      let jsonObj = JSON.parse(splitContent.content);
      console.log(jsonObj);
      expect(typeof jsonObj.alipay).to.be.equal('undefined');
      expect(typeof jsonObj.baidu).to.be.equal('undefined');
      expect(typeof jsonObj.wx).to.be.equal('object');
    }
  })
  it('contentIgnoreHanle interface', function () {
    cml.config.merge({
      platforms: ['web', 'weex', 'wx']
    })
    let content = fs.readFileSync(path.join(__dirname, './index.interface'), {encoding: 'utf8'});
    let result = initCommander.contentIgnoreHanle(content, 'interface');
    expect(/cml\-type\=\"wx\"/.test(result)).to.be.equal(true); 
    expect(/cml\-type\=\"web\"/.test(result)).to.be.equal(true); 
    expect(/cml\-type\=\"weex\"/.test(result)).to.be.equal(true); 
    expect(!/cml\-type\=\"alipay\"/.test(result)).to.be.equal(true); 
  })
})
