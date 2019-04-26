const utils = require('../utils.js');
const {expect} = require('chai');

describe('utils.js', function() {
  it('test getStyleKeyValue', function() {
    let source = `background-url:(http:www.didi.chameleon.png)`
    let result = utils.getStyleKeyValue(source);
    expect(result).to.include.keys('key');
    expect(result).to.include.keys('value');
  })
})
