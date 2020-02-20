const compileTemplate = require('../src/index.js');
const source = `<template>
<page title="Chameleon">
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
</page>
</template>`
// <view><text :class="{{true? 'bg-green':''}}" >fafafa</text></view>
// <view><text :class="true? 'bg-green':''" >fafafa</text></view>
//
// let result = compileTemplate(source,'web');
let options = {lang: 'cml',
  filePath: '/Users/didi/components.cml',
  buildInComponents: {button: "cml-buildin-button"},
  isInjectBaseStyle: false,
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
    tagName: 'cube-button',
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
let analyzeOptions = { 
  buildInComponents:
  { audio: 'cml-buildin-audio',
    button: 'cml-buildin-button',
    'carousel-item': 'cml-buildin-carousel-item',
    carousel: 'cml-buildin-carousel',
    checkbox: 'cml-buildin-checkbox',
    input: 'cml-buildin-input',
    aside: 'cml-buildin-aside',
    col: 'cml-buildin-col',
    container: 'cml-buildin-container',
    foot: 'cml-buildin-foot',
    head: 'cml-buildin-head',
    main: 'cml-buildin-main',
    row: 'cml-buildin-row',
    list: 'cml-buildin-list',
    'native-scroller': 'cml-buildin-native-scroller',
    page: 'cml-buildin-page',
    radio: 'cml-buildin-radio',
    'refresh-loadding': 'cml-buildin-refresh-loadding',
    'refresh-view': 'cml-buildin-refresh-view',
    richtext: 'cml-buildin-richtext',
    scroller: 'cml-buildin-scroller',
    switch: 'cml-buildin-switch',
    textarea: 'cml-buildin-textarea',
    video: 'cml-buildin-video' },
 usedBuildInTagMap: {},
 cmlType: 'wx' }
// console.log('before-compile', source);
// let result_web = compileTemplate(source, 'web', options);
// let result_weex = compileTemplate(source, 'weex', options);
// let result_wx = compileTemplate(source, 'wx', options);
// let result_baidu = compileTemplate(source, 'baidu', options);
// // let result_alipay = compileTemplate(source, 'alipay', options);
// console.log('result_web', result_web)
// console.log('result_weex', result_weex)
// console.log('result_wx', result_wx)
// console.log('result_baidu', result_baidu)
// console.log('result_alipay', result_alipay)
const {preParseMultiTemplate ,analyzeTemplate}= compileTemplate;
// const result = preParseMultiTemplate(source,'web',{needTranJSX:true,needDelTemplate:true})
// console.log('result',result)
const result2 = analyzeTemplate(source,analyzeOptions)
console.log('result',result2)