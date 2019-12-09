const parseCss = require('../../parser/miniapp.js');
const expect = require('chai').expect;

let source = `body {width:100cpx;font-size:26px;/* height:200px; */}`;
describe('parse/miniapp', function() {
  it('parse cssstyle px to rpx but leave comment in style alone', function() {
    let result = parseCss(source,{
      cmlType:'alipay',
      filePath:"chameleon-runtime/src/platform/alipay/style/index.css"
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
