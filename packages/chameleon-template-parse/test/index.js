const compileTemplate = require('../src/index.js');
const source = `<comp c-animation="{{modelValueTest2}}" ></comp>`
// <view><text :class="{{true? 'bg-green':''}}" >fafafa</text></view>
// <view><text :class="true? 'bg-green':''" >fafafa</text></view>
//
// let result = compileTemplate(source,'web');
let options = {lang: 'cml',
  buildInComponents: {button: "cml-buildin-button"},
  cmss: {
    rem: true,
    scale: 0.5,
    remOptions: {
    // base on 750px standard.
      rootValue: 75,
      // to leave 1px alone.
      minPixelValue: 1.01
    },
    autoprefixOptions: {
      browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
    }
  },
  usingComponents: [{
    tagName: 'thirdComp1',
    refUrl: '/path/to/ref1',
    filePath: 'path/to/real1',
    isNative: true
  }, {
    tagName: 'thirdComp2',
    refUrl: '/path/to/ref2',
    filePath: 'path/to/real2',
    isNative: false
  }]
};
console.log('before-compile', source);
let result_web = compileTemplate(source, 'web', options);
let result_wx = compileTemplate(source, 'wx', options);
let result_baidu = compileTemplate(source, 'wx', options);
let result_alipay = compileTemplate(source, 'alipay', options);
// let result_alipay = compileTemplate(source,'alipay',{lang:'cml'});
console.log('result_web', result_web)
// console.log('result_wx', result_wx)
// console.log('result_alipay', result_alipay)
// console.log('result_baidu', result_baidu)
