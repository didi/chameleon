var log = require('../../lib/log.js');
var expect = require('chai').expect;

describe('log.js', function () {
  it('it should console debug', function () {
    expect(log.debug('log.debug')).to.equal(undefined);
  })
  it('it should console notice', function () {
    expect(log.notice('log.notice')).to.equal(undefined);
  })
  it('it should console warn', function () {
    expect(log.warn('log.warn')).to.equal(undefined);
  })
  it('it should console error', function () {
    expect(log.error('log.error')).to.equal(undefined);
  })

  it('it should set Log level', function () {
    log.setLogLevel('debug');
    expect(log.debug('log.error')).to.equal(undefined);
  })


})
