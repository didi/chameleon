const config = require('../config');
const assert = require('chai').assert;
const path = require('path');

describe('lintrc', function() {
  describe('lintrc-check', function() {
    it('standard', function() {
      const projectRoot = path.resolve(__dirname, './lintrc/standard');
      config.init(projectRoot);
      assert.equal(config.getRuleOption('core-files-check'), false);
    });
    it('nonstandard', function() {
      const projectRoot = path.resolve(__dirname, './lintrc/nonstandard');
      config.init(projectRoot);
      assert.equal(config.getRuleOption('core-files-check'), true);
    });
  });
});
