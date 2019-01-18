const config = require('../config');
const utils = require('../utils');
const fileSpec = require('../file-spec');
const chai = require('chai');
const assert = chai.assert;
const should = chai.should;
const expect = chai.expect;
const path = require('path');

describe('interface', function() {
  describe('lint-interface', function() {
    it('interface-standard', async function() {
      const interfacePath = path.resolve(__dirname, './interface/common.interface');
      const result = await fileSpec(interfacePath, 'interface');
      let flag = false;
      Object.keys(result).forEach(key => {
        if (result[key].messages.length) {
          flag = true;
        }
      });
      assert.equal(flag, false);
    });

  });
});
