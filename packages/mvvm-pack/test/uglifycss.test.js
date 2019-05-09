let _ = require('../minimize/uglifycss');
const expect = require('chai').expect;

describe('uglifycss', function() {
  it('normal css', function() {
    let code = `
      .class1 {
        font-size: 24px;
      }
      .class2 {
        color: red;
        -webkit-box-orient: block-axis;
      }
    `
    let result = _(code)
    expect(result).to.be.equal('.class1{font-size:24px}.class2{color:red;-webkit-box-orient:block-axis}')
  })

})

