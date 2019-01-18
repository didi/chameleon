

const utils = require('../utils.js');
const expect = require('chai').expect;


describe('utils', function() {
  it('transform singlequot to doublequot', function() {
    expect(utils.singlequot2doublequot(`'`)).to.be.equal(`"`);
  });
  it('unique cssStyleValue ', function() {
    expect(utils.uniqueStyle(`width:300px;width:300px`)).to.be.equal(`width:300px`)
  });
  it('disappearCssComment', function() {
    expect(utils.disappearCssComment(`/*width:300px;*/`)).to.be.empty;
  })
})


