const {pathMatch} = require('../helpers.js');
const {expect} = require('chai');

describe('test helpers.js', function() {
  it('test parse url', function() {
    let url = 'https://www.chameleon.com/path/to/index?query=username&query1=age'; 
    let result = pathMatch(url, `/path/to/index`);
    expect(result).to.be.ok;
  })
})
