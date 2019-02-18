var postcss = require('postcss');
var weexPlus = require('../../postcss/weex-plus');
var content = `
.class1 {
  lines: 1;
}
`
const expect = require('chai').expect;

describe('postcss/weex-plus', function() {
  it('convert lines', function() {

    let ret = postcss(weexPlus()).process(content).css;
    console.log(ret)
    expect(ret).to.equal(`\n.class1 {\n  lines: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n}\n`);
  })
})
