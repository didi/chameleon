const check = require('../lib/check');
const { expect } = require('chai');

const reportErrorFun = function(source,type){
  const tokens = check(source, { cmlType: type });
  const sourceLine = source.split('\n');
  let errorInfo = '';
  if (tokens && tokens.length) {
    tokens.forEach(token => {
      errorInfo += `不能在${type} 项目中使用全局变量【${token.name}】具体代码: ${sourceLine[token.loc.line - 1]}`
    })
  };
  return {tokens,errorInfo}
}
//以lib/tokensMap中的文件为基础；
describe('check global variable', function () {
  //检测web中不允许出现weex和wx端的全局变量：['weex','wx','global]
  describe('test lib/check.js for web', function () {
    it('test web global variable that can be used in web ', function () {
      const type = "Web";
      const source = `window.onload=function(){
        window.frames[0].postMessage('getcolor','http://lslib.com');}`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.be.empty;
    });
    it('test weex global variable that can not be used in web', function () {
      const type = "Web";
      const source = `weex.show()`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.not.be.empty;
    });
    it('test wx global variable  that can not be used in web', function () {
      const type = "Web";
      const source = `wx.login()`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.not.be.empty;
    })
  });
  //检测weex端不允许出现web和wx端的全局变量：['wx','onload',....]
  describe('test lib/check.js for web', function () {
    it('test weex global variable that can be used in weex', function () {
      const type = "Weex";
      const source = `weex.show()`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.be.empty;
    });
    it('test web global variable that can not be used in weex ', function () {
      const type = "Weex";
      const source = `window.onload=function(){
        window.frames[0].postMessage('getcolor','http://lslib.com');}`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.not.be.empty;
    });
    it('test wx global variable  that can not be used in weex', function () {
      const type = "Weex";
      const source = `wx.login()`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.not.be.empty;
    })
  });
  //检测wx端不允许出现weex和web端的全局变量：['weex','onload',...]
  describe('test lib/check.js for web', function () {
    it('test wx global variable  that can be used in wx', function () {
      const type = "Wx";
      const source = `wx.login()`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.be.empty;
    })
    it('test weex global variable that can not be used in wx', function () {
      const type = "Wx";
      const source = `weex.show()`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.not.be.empty;
    });
    it('test web global variable that can not be used in wx ', function () {
      const type = "Wx";
      const source = `window.onload=function(){
        window.frames[0].postMessage('getcolor','http://lslib.com');}`
      const {tokens,errorInfo} = reportErrorFun(source,type);
      expect(errorInfo).to.not.be.empty;
    });
    
  })
})

