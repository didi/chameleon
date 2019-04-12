const processTemplate = require('./process-template.js');
let source = `<template>
<view>
<!-- 事件 -->
<view :id="value" name="nameStr" @click="handleClick"></view>
<view @click.stop="handleClick(1,2,item)"></view>
<view v-on:click.stop="handleClick(1,2,item)"></view>
<!-- 指令 v-if v-else-if v-else v-model v-show v-text-->
<view v-if="1 > 0.5">A</view>
<view v-else-if="show">B</view>
<view v-else>c</view>
<view v-show="!show"></view>
    <view v-model="modelValue"></view>
    <view v-text="text"></view>
    <!-- 循环 -->
    <view v-for="item in array" :key="item.id">
      <view>{{item.id}}{{item[11]}}</view>
    </view>
    <view style="background-color:red"></view>
    <view :style="computedStyle"></view>
    <view class="cls1 cls2" :class="true ? 'cls3':'cls4'"></view>
    <view  class="cls1 cls2"></view>
    <view  :class="true ? 'cls4' : 'cls5'"></view>
    <button></button>
</view>
</template>`
let options = {lang: 'cml',
  buildInComponents: {button: "cml-buildin-button"},
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
// let source = `<view style="{{item.id}}">{{item.id}}{{item[11]}}</view>`
let result = processTemplate.vueToCml(source,options);
console.log('sss', result)
