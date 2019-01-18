const utils = require('../utils');
const assert = require('chai').assert;

describe('utils', function() {
  it('toDash', function() {
    let result = utils.toDash('abcDefGhi');
    assert.equal(result, 'abc-def-ghi');
  });
});
