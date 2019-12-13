const parseCss = require('../../parser/miniapp.js');
const expect = require('chai').expect;

let source = `body {width:100cpx;font-size:26px;/* height:200px; */}`;
let alipayCSS = `.cls1{color:red} .cls2{width:100cpx;height:200cpx;}  .cls3:{font-size:30cpx;}`
describe('parse/miniapp', function() {
  it('parse cssstyle px to rpx but leave comment in style alone', function() {
    let result = parseCss(source,{
      cmlType:'alipay',
      filePath:"chameleon-runtime/src/platform/alipay/style/index.css"
    });
    expect(/100rpx/.test(result)).to.be.ok;
  })
  it('parse cssstyle px to rpx but leave comment in style alone', function() {
    let result = parseCss(alipayCSS,{
      cmlType:'alipay',
      filePath:"/src/page/index.cml"
    });
    expect(/100rpx/.test(result)).to.be.ok;
  })
  it('parse cssstyle px to rpx but leave comment in style alone', function() {
    let result = parseCss(source,{
      cmlType:'wx',
      filePath:"chameleon-runtime/src/platform/alipay/style/index.css"
    });
    expect(/100rpx/.test(result)).to.be.ok;
  })
})
