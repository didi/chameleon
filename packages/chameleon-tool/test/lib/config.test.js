var config = require('../../lib/config.js');
var expect = require('chai').expect;
const _ = require('chameleon-tool-utils');
describe('config', function () {
  it('it should get config Object', function () {
    let result = config.get();
    expect(_.is(result, 'Object')).to.equal(true);
  });

  it('config merge', function () {
    let result = config.get();
    let beforeCheckEnable = result.check.enable;
    let obj = {
      templateType: 'test', // 直接覆盖
      check: { // merge
        enableTypes: ['test'] // 直接覆盖
      }
    }
    config.merge(obj);

    let newresult = config.get();

    expect(newresult.templateType).to.equal('test');
    expect(newresult.check.enable).to.equal(beforeCheckEnable);
  })

  it('config assign', function () {
    let obj = {
      templateType: 'test', // 直接覆盖
      check: { // merge
        enableTypes: ['test'] // 直接覆盖
      }
    }
    config.assign(obj);

    let newresult = config.get();

    expect(newresult.templateType).to.equal('test');
    expect(newresult.check.enable).to.equal(undefined);
  })
})
