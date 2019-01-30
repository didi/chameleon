const compileTemplate = require('../src/index.js');
// const source = `<template id="{{cls}}" class="{{5 > 6 ? 'cls1':'cls2'}}" style="{{computedStyle}}" name="{{5 <6 ? 'cls1':'cls2}} " title="大家好">  文本
// <c-page title="carousel">
//   <button title="你好" name="cls1" name="{{5 > 6 ? 'cls1':'cls2}}" style="{{computedStyle}}">
//   {{5 > 6 ? '你好':'我好'}}
//   </button>
//   <input/>{{你好}}

// </c-page>
// </template>`
// const source = `<template :id="cls" :class="5 > 6 ? 'cls1':'cls2'" :name="5 < 6 ? 'cls1':'cls2 " title="大家好">
// <c-page title="carousel">
//   <button title="你好" :name="cls1" :name="5 > 6 ? 'cls1':'cls2" :style="computedStyle">
//   {{5 > 6 ? '你好':'我好'}}
//   </button>
//   <input/>{{你好}}

// </c-page>
// </template>`
// let source = `<button title="你好" :class="5 < 6 ? 'cls1':'cls2'" :class="5 > 6 ? 'cls1':'cls2" :style="computedStyle">
//   {{5 > 6 ? '你好':'我好'}} >   </button>`
// <view><text :class="{{true? 'bg-green':''}}" >fafafa</text></view>
// <view><text :class="true? 'bg-green':''" >fafafa</text></view>
//
const source = `
<page title="cml">
    <view class="page-home">
      <scroller height="{{-1}}">
        <view class="logo-row">
          <image class="logo-icon" src="{{homeLogo}}"></image>
          <text class="logo-desc">Chameleon</text>
        </view>
        <view class="list">
          <view class="list-cell" c-for="{{pageList}}" c-for-item="pageInfo" c-bind:tap="onItemSelected(pageInfo.url)">
            <view class="content-item row">
              <image class="content-item-left-icon" src="{{pageInfo.icon}}"></image>
              <view class="text-group">
                <text class="text-title">{{pageInfo.title}}</text>
                <text class="text-desc">{{pageInfo.desc}}</text>
              </view>         
              <image class="content-item-right-icon" src="{{arrowRight}}"></image>
            </view>
          </view>    
        </view>
      </scroller>
    </view>
</page>`
// let result = compileTemplate(source,'web');
let options = {lang: 'cml',
  buildInComponents: {button: "cml-buildin-button", container: "cml-buildin-container"},
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
// let result_web = compileTemplate(source, 'web', options);
// let result_wx = compileTemplate(source, 'wx', options);
// let result_baidu = compileTemplate(source, 'wx', options);
let result_alipay = compileTemplate(source, 'alipay', options);
// let result_alipay = compileTemplate(source,'alipay',{lang:'cml'});
// console.log('result_web', result_web)
// console.log('result_wx', result_wx)
console.log('result_alipay', result_alipay)
// console.log('result_baidu', result_baidu)
