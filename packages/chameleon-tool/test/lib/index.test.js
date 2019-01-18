process.argv = ['node', 'chameleon.js'];
require('../../lib/index.js');
var expect = require('chai').expect;
describe('index.js', function () {
  it('cml has config', function () {
    expect(cml).to.have.property('config');
  })
  it('cml has root', function () {
    expect(cml).to.have.property('root');
  })
  it('cml has projectRoot', function () {
    expect(cml).to.have.property('projectRoot');
  })
  it('cml has utils', function () {
    expect(cml).to.have.property('utils');
  })
  it('cml has cli', function () {
    expect(cml).to.have.property('cli');
  })
  it('cml has log', function () {
    expect(cml).to.have.property('log');
  })
  it('cml has event', function () {
    expect(cml).to.have.property('event');
  })

})
