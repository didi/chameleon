const utils = require('../utils.js');
const {expect} = require('chai');

describe('utils.js', function() {
  it('test getStyleKeyValue', function() {
    let source = `background-url:(http:www.didi.chameleon.png)`
    let result = utils.getStyleKeyValue(source);
    expect(result).to.include.keys('key');
    expect(result).to.include.keys('value');
  });
  it('test handleEventType', function() {
    expect(utils.handleEventType('touchStart')).to.equal('touchstart')
    expect(utils.handleEventType('touchMove')).to.equal('touchmove')
    expect(utils.handleEventType('touchEnd')).to.equal('touchend')
    expect(utils.handleEventType('tap')).to.equal('tap')
  });
  it('test handleCompEventType', function() {
    expect(utils.handleCompEventType('touchstart')).to.equal('touchStart')
    expect(utils.handleCompEventType('touchmove')).to.equal('touchMove')
    expect(utils.handleCompEventType('touchend')).to.equal('touchEnd')
    expect(utils.handleCompEventType('tap')).to.equal('tap')
  });
})
