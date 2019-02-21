const compileTemplate = require('../src/index.js');
const source = `<scroller :height="-1">
<view> <text>cpxtest</text> </view>
<view :style="'width:'+cpx+'cpx;'+'height:'+cpx2+'cpx;background-color:red'">cpx</view>
<view @click="handleClick">change-component-vue</view>
<view @click="handleClick(1,2,3)">change-component</view>
  <component :is="currentComp" :image-src="chameleonSrc" title="this is title"></component>
  <show v-show="show"></show>
  <view v-text="message"></view>
  <view :class="5 > 6 ? 'cls1':'cls2'" :style="5 < 6 ? 'width:300cpx':'height:300cpx'">
    {{5 > 6?'5>6' : '5 < 6'}}</view>
  <view v-if="false">c-if</view>
  <view v-else-if="true">c-else-if</view>
  <view v-else>c-else</view>
  
  <demo-com :image-src="chameleonSrc" title="标题"></demo-com>
  <view :style="computedStyle">computedStyle</view>
  <view><text>v-model的使用</text></view>
  <input type="text" v-model=" modelValueTest  "/>
  <text>{{modelValueTest}}</text>

  <comp v-model=" modelValueTest2 " ></comp>
  <view><text>组件使其改变{{modelValueTest2}}</text></view>

</scroller>`
// <view><text :class="{{true? 'bg-green':''}}" >fafafa</text></view>
// <view><text :class="true? 'bg-green':''" >fafafa</text></view>
//
// let result = compileTemplate(source,'web');
let options = {lang: 'vue',
  filePath: '/Users/didi/components.cml',
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
console.log('before-compile', source);
// let result_web = compileTemplate(source, 'web', options);
let result_wx = compileTemplate(source, 'wx', options);
// let result_baidu = compileTemplate(source, 'wx', options);
// let result_alipay = compileTemplate(source, 'alipay', options);
// let result_alipay = compileTemplate(source,'alipay',{lang:'cml'});
// console.log('result_web', result_web)
// console.log('result_wx', result_wx)
// console.log('result_alipay', result_alipay)
// console.log('result_baidu', result_baidu)
