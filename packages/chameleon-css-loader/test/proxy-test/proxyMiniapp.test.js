const parseCss = require('../../proxy/proxyMiniapp.js');
const expect = require('chai').expect;

let source = `width:75cpx;font-size:26px;/* height:200px; */`;
describe('proxy/miniapp', function() {
  it('parse miniapp cssvalue cpx to rpx', function() {
    let result = parseCss(source);
    expect(/75rpx/.test(result)).to.be.ok;
  })
})


