const config = require('../config');
const fileStruture = require('../file-structure');
const assert = require('chai').assert;
const path = require('path');

describe('core', function() {
  describe('core-file-check', function() {
    it('standard', function() {
      const projectRoot = path.resolve(__dirname, './core/standard');
      config.init(projectRoot);
      const result = fileStruture();
      assert.equal(result.core.messages.length, 0);
    });

    it('nonstandard', function() {
      const projectRoot = path.resolve(__dirname, './core/nonstandard');
      config.init(projectRoot);
      const result = fileStruture();
      assert.equal(result.core.messages.length, 3);
    });

    it('checkproject', function() {
      const projectRoot = path.resolve(__dirname, './core/nonstandard');
      config.init(projectRoot);
      const result = config.isChameleonProject();
      assert.equal(result, false);
    });


  });
});
