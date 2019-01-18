const prehandle = require('../../../src/utils/prehandle.js');
const expect = require('chai').expect;

let content1 = `
<style>
.name {

}
</style>
`

let content2 = `
<style scoped >
.name {

}
</style>

`

let self = {
  resourcePath: 'User/yyl/1.cml'
}
describe('prehandle.js', function() {
  it('injectWeexBaseStyle', function() {
    let result1 = prehandle.injectWeexBaseStyle(content1, self);
    console.log(result1)
    expect(!!~result1.indexOf(`@import 'chameleon-runtime/src/platform/weex/style/index.css';`)).to.be.equal(true);
  });

  it('webAddStyleScope', function() {
    let result1 = prehandle.webAddStyleScope(content1, self);
    console.log(result1)
    expect(!!~result1.indexOf(`scoped`)).to.be.equal(true);

    let result2 = prehandle.webAddStyleScope(content2, self);
    console.log(result2)
    expect(result2 === content2).to.be.equal(true);
  });
 
})


