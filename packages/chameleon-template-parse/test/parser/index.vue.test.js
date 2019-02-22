
// // vue单个语法的单元测试
// const babylon = require('babylon');
// const t = require('@babel/types');
// const traverse = require('@babel/traverse')["default"];
// const generate = require('@babel/generator')["default"];
// const parseTemplate = require('../../src/parser/index.js');
// const expect = require('chai').expect;
// let options = {lang: 'vue',
//   buildInComponents: {button: "cml-buildin-button"},
//   filePath: '/User/Jim-W/didi/component/button.cml',
//   cmss: {
//     rem: true,
//     scale: 0.5,
//     remOptions: {
//     // base on 750px standard.
//       rootValue: 75,
//       // to leave 1px alone.
//       minPixelValue: 1.01
//     },
//     autoprefixOptions: {
//       browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
//     }
//   },
//   usingComponents: [{
//     tagName: 'thirdComp1',
//     refUrl: '/path/to/ref1',
//     filePath: 'path/to/real1',
//     isNative: true
//   }, {
//     tagName: 'thirdComp2',
//     refUrl: '/path/to/ref2',
//     filePath: 'path/to/real2',
//     isNative: false
//   }]
// };
// function compileTemplate(source, type, options, callback) {
//   const ast = babylon.parse(source, {
//     plugins: ['jsx']
//   })
//   traverse(ast, {
//     enter(path) {
//       callback(path, type, options);
//     }
//   });
//   let result = generate(ast).code;
//   if (/;$/.test(result)) { // 这里有个坑，jsx解析语法的时候，默认解析的是js语法，所以会在最后多了一个 ; 字符串；但是在 html中 ; 是无法解析的；
//     result = result.slice(0, -1);
//   }

//   return result;
// }
// // cml语法的单元测试
// describe('parse-template-vue', function() {
//   describe('parseTag', function() { // 各个端的标签转化单元测试不做全覆盖，逻辑相对简单
//     let source = `<view></view>`;

//     let callback = parseTemplate.parseTag;
//     let result = compileTemplate(source, 'web', options, callback);
//     it('test-tag-transform', function() {
//       expect(result).to.equal(`<div></div>`)
//     });
//   });
//   describe('afterParseTag', function() { // 各个端的标签转化单元测试不做全覆盖，逻辑相对简单
//     let source = `<block></block>`;

//     let callback = parseTemplate.afterParseTag;
//     it('test-after-tag-transform-web-weex', function() {
//       expect(compileTemplate(source, 'web', options, callback)).to.equal(`<template></template>`)
//     });
//     it('test-after-tag-transform-miniapp', function() {
//       expect(compileTemplate(source, 'wx', options, callback)).to.equal(`<block></block>`)
//     });
//   });
//   describe('parseBuildTag', function() { // 各个端的标签转化单元测试不做全覆盖，逻辑相对简单
//     let source = `<button></button>`;
//     let callback = parseTemplate.parseBuildTag;
//     let result = compileTemplate(source, 'web', options, callback);
//     it('test-build-tag-transform', function() {
//       expect(result).to.equal(`<cml-buildin-button></cml-buildin-button>`)
//     });
//   });
//   describe('parseTagForSlider', function() {
//     let source = `<carousel><carousel-item></carousel-item></carousel>`;

//     let callback = parseTemplate.parseTagForSlider;
//     let result = compileTemplate(source, 'wx', options, callback);
//     it('parseTagForSlider for wx', function() {
//       expect(result).to.equal(`<swiper><swiper-item></swiper-item></swiper>`)
//     });
//   });
//   // parseRefStatement:仅在所有的小程序端进行处理
//   describe('parseRefStatement-miniapp', function() {
//     let source = `<view ref="flag"></view>`;

//     let callback = parseTemplate.parseRefStatement;
//     let result = compileTemplate(source, 'wx', options, callback);
//     it('test-ref-transform', function() {
//       expect(result).to.equal(`<view id="flag" class="_cml_ref_lmc_"></view>`)
//     });
//   });
//   // parseVue2WxStatement:测试v-if语法转化为小程序
//   describe('parseVue2WxStatement-miniapp', function() {
//     let source = `<view><view v-if="true"></view><view v-else-if="true"></view><view v-else="true"></view></view>`;

//     let callback = parseTemplate.parseVue2WxStatement;
//     let result_wx = compileTemplate(source, 'wx', options, callback);
//     let result_baidu = compileTemplate(source, 'baidu', options, callback);
//     let result_alipay = compileTemplate(source, 'alipay', options, callback);
//     it('test-condition-web-transform', function() {
//       expect(result_wx).to.equal(`<view><view wx:if="{{true}}"></view><view wx:elif="{{true}}"></view><view wx:else="{{true}}"></view></view>`)
//       expect(result_alipay).to.equal(`<view><view a:if="{{true}}"></view><view a:elif="{{true}}"></view><view a:else="{{true}}"></view></view>`)
//       expect(result_baidu).to.equal(`<view><view s-if="true"></view><view s-elif="true"></view><view s-else="true"></view></view>`)
//     });
//   });
//   // parseVue2WxStatement：测试v-for语法转化为小程序
//   describe('parseVue2WxStatement-web', function() {
//     let source = `<view v-for="(m,i) in array" v-bind:key="item.id"><view v-for="item in array"></view></view>`;

//     let callback = parseTemplate.parseVue2WxStatement;
//     let result = compileTemplate(source, 'web', options, callback);
//     it('test-Iteration-transform', function() {
//       expect(result).to.equal(`<view v-for="(m,i) in array" v-bind:key="item.id"><view v-for="item in array"></view></view>`)
//     });
//   });
//   describe('parseVue2WxStatement-weex', function() {
//     let source = `<view v-for="(m,i) in array" v-bind:key="id"><view v-for="item in array"></view></view>`;

//     let callback = parseTemplate.parseVue2WxStatement;
//     let result = compileTemplate(source, 'weex', options, callback);
//     it('test-Iteration-transform', function() {
//       expect(result).to.equal(`<view v-for="(m,i) in array" v-bind:key="id"><view v-for="item in array"></view></view>`)
//     });
//   });
//   describe('parseVue2WxStatement-wx', function() {
//     let source = `<view v-for="(m,i) in array" v-bind:key="id"><view v-for="item in array"></view></view>`;

//     let callback = parseTemplate.parseVue2WxStatement;
//     let result = compileTemplate(source, 'wx', options, callback);
//     it('test-Iteration-transform', function() {
//       expect(result).to.equal(`<view wx:for-item="m" wx:for-index="i" wx:for="{{array}}" wx:key="id"><view wx:for-item="item" wx:for-index="index" wx:for="{{array}}"></view></view>`)
//     });
//   });
//   describe('parseVue2WxStatement-alipay', function() {
//     let source = `<view v-for="(m,i) in array" v-bind:key="id"><view v-for="item in array"></view></view>`;

//     let callback = parseTemplate.parseVue2WxStatement;
//     let result = compileTemplate(source, 'alipay', options, callback);
//     it('test-Iteration-transform', function() {
//       expect(result).to.equal(`<view a:for-item="m" a:for-index="i" a:for="{{array}}" a:key="id"><view a:for-item="item" a:for-index="index" a:for="{{array}}"></view></view>`)
//     });
//   });
//   describe('parseVue2WxStatement-baidu', function() {
//     let source = `<view v-for="(m,i) in array" v-bind:key="id"><view v-for="item in array"></view></view>`;

//     let callback = parseTemplate.parseVue2WxStatement;
//     let result = compileTemplate(source, 'baidu', options, callback);
//     it('test-Iteration-transform', function() {
//       expect(result).to.equal(`<view s-for-item="m" s-for-index="i" s-for="array" s-key="id"><view s-for-item="item" s-for-index="index" s-for="array"></view></view>`)
//     });
//   });

//   // parseVue2WxStatement:测试 v-bind转化为小程序端的响应值
//   describe('parseVue2WxStatement-miniapp', function() {
//     let source = `<view><view prop1="static" v-bind:prop2="dynamic"></view></view>`;

//     let callback = parseTemplate.parseVue2WxStatement;
//     let result_wx = compileTemplate(source, 'wx', options, callback);
//     let result_alipay = compileTemplate(source, 'alipay', options, callback);
//     let result_baidu = compileTemplate(source, 'baidu', options, callback);
//     it('test-attribute-transform', function() {
//       expect(result_wx).to.equal(`<view><view prop1="static" prop2="{{dynamic}}"></view></view>`)
//       expect(result_alipay).to.equal(`<view><view prop1="static" prop2="{{dynamic}}"></view></view>`)
//       expect(result_baidu).to.equal(`<view><view prop1="static" prop2="{{dynamic}}"></view></view>`)
//     });
//   });
//   describe('parseAttributeStatement-web-weex', function() {
//     let source = `<view><view prop1="static" v-bind:prop2="dynamic"></view></view>`;

//     let callback = parseTemplate.parseAttributeStatement;
//     let result = compileTemplate(source, 'web', options, callback);
//     it('test-attribute-transform', function() {
//       expect(result).to.equal(`<view><view prop1="static" v-bind:prop2="dynamic"></view></view>`)
//     });
//   });
//   // vue语法下style只支持一个style；parseStyleStatement
//   describe('parseStyleStatement-web', function() {
//     let source = `<view v-bind:style="dynamicColor"><view style="color:red"></view></view>`;
//     let callback = parseTemplate.parseStyleStatement;
//     let result = compileTemplate(source, 'web', options, callback);
//     it('test-style-transform', function() {
//       expect(result).to.equal(`<view v-bind:style="_cmlStyleProxy((dynamicColor),{'rem':true,'scale':0.5,'remOptions':{'rootValue':75,'minPixelValue':1.01},'autoprefixOptions':{'browsers':['> 0.1%','ios >= 8','not ie < 12']}})"><view style="color:red"></view></view>`)
//     });
//   });
//   describe('parseStyleStatement-weex', function() {
//     let source = `<view v-bind:style="dynamicColor"><view style="color:red;width:20px"></view></view>`;
//     let callback = parseTemplate.parseStyleStatement;
//     let result = compileTemplate(source, 'weex', options, callback);
//     it('test-style-transform', function() {
//       expect(result).to.equal(`<view v-bind:style="_cmlStyleProxy((dynamicColor))"><view style="color: #ff0000;width: 20px"></view></view>`)
//     });
//   });
//   describe('parseStyleStatement-miniapp', function() {
//     let source = `<view ><view style="color:red;width:20px"></view></view>`;
//     let callback = parseTemplate.parseStyleStatement;
//     let result_wx = compileTemplate(source, 'wx', options, callback);
//     let result_alipay = compileTemplate(source, 'alipay', options, callback);
//     let result_baidu = compileTemplate(source, 'baidu', options, callback);
//     it('test-style-transform', function() {
//       expect(result_wx).to.equal(`<view><view style="color:red;width:20px"></view></view>`)
//       expect(result_alipay).to.equal(`<view><view style="color:red;width:20px"></view></view>`)
//       expect(result_baidu).to.equal(`<view><view style="color:red;width:20px"></view></view>`)
//     });
//   });
//   // parseClassStatement
//   describe('parseClassStatement-web', function() {
//     let source = `<view><view class="cls1 cls2" v-bind:class="true?'cls3':'cls4'"></view></view>`;

//     let callback = parseTemplate.parseClassStatement;
//     let result = compileTemplate(source, 'web', options, callback);
//     it('test-class-transform', function() {
//       expect(result).to.equal(`<view class=" cml-base cml-view"><view class="cls1 cls2   cml-base cml-view" v-bind:class="true?'cls3':'cls4'"></view></view>`)
//     });
//   });
//   describe('parseClassStatement-weex', function() {
//     let source = `<view><view class="cls1 cls2" v-bind:class="true?'cls3':'cls4'"></view></view>`;

//     let callback = parseTemplate.parseClassStatement;
//     let result = compileTemplate(source, 'weex', options, callback);

//     it('test-class-transform', function() {
//       expect(result).to.equal(`<view class=" cml-base cml-view"><view class="cls1 cls2   cml-base cml-view" v-bind:class="_weexClassProxy((true?'cls3':'cls4'))"></view></view>`)
//     });
//   });
//   describe('parseClassStatement-wx-alipay-baidu', function() {
//     let source = `<view><view class="cls1 cls2" v-bind:class="true?'cls3':'cls4'"></view></view>`;

//     let callback = parseTemplate.parseClassStatement;
//     let result = compileTemplate(source, 'wx', options, callback);
//     it('test-class-transform', function() {
//       expect(result).to.equal(`<view class=" cml-base cml-view"><view class="{{true?'cls3':'cls4'}} cls1 cls2  cml-base cml-view"></view></view>`)
//     });
//   });
//   // parseDirectiveStatement
//   describe('parseDirectiveStatement-web-weex', function() {
//     let source = `<view><input v-model=" searchText " /><custom-input v-model="search"></custom-input></view>`;

//     let callback = parseTemplate.parseDirectiveStatement;
//     let result = compileTemplate(source, 'web', options, callback);
//     it('test-class-transform', function() {
//       expect(result).to.equal(`<view><input v-on:input="_cmlModelEventProxy($event,'searchText')" v-bind:value="searchText" /><custom-input v-on:input="_cmlModelEventProxy($event,'search')" v-bind:value="search"></custom-input></view>`)
//     });
//   });
//   describe('parseDirectiveStatement-wx-alipay-baidu', function() {
//     let source = `<view><input v-model=" searchText " /><custom-input v-model="search"></custom-input></view>`;

//     let callback = parseTemplate.parseDirectiveStatement;
//     let result_wx = compileTemplate(source, 'wx', options, callback);
//     let result_baidu = compileTemplate(source, 'baidu', options, callback);
//     let result_alipay = compileTemplate(source, 'alipay', options, callback);
//     it('test-v-model', function() {
//       expect(result_wx).to.equal(`<view><input data-modelkey="searchText" bindinput="_cmlModelEventProxy" value="{{ searchText }}" /><custom-input data-modelkey="search" bindinput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
//       expect(result_baidu).to.equal(`<view><input data-modelkey="searchText" bindinput="_cmlModelEventProxy" value="{{ searchText }}" /><custom-input data-modelkey="search" bindinput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
//       expect(result_alipay).to.equal(`<view><input data-modelkey="searchText" bindInput="_cmlModelEventProxy" value="{{ searchText }}" /><custom-input data-modelkey="search" bindInput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
//     });
//   });
//   // c-show
//   describe('parseDirectiveStatement-web', function() {
//     let source = `<view v-show="true"></view>`;

//     let callback = parseTemplate.parseDirectiveStatement;
//     let result = compileTemplate(source, 'web', options, callback);
//     it('test-c-show-transform', function() {
//       // style后续会通过parseStyle接着进行解析；
//       expect(result).to.equal(`<view v-show="true"></view>`)
//     });
//   });
//   // c-text
//   describe('parseDirectiveStatement-web-miniapp', function() {
//     let source = `<view v-text="value1">everything will be replaced</view>`;

//     let callback = parseTemplate.parseDirectiveStatement;
//     it('test-c-text-transform', function() {
//       expect(compileTemplate(source, 'web', options, callback)).to.equal(`<view>{{value1}}</view>`)
//     });
//     it('test-c-text-transform', function() {
//       expect(compileTemplate(source, 'wx', options, callback)).to.equal(`<view>{{value1}}</view>`)
//     });
//     it('test-c-text-transform', function() {
//       expect(compileTemplate(source, 'weex', options, callback)).to.equal(`<view>{{value1}}</view>`)
//     });
//   });
//   describe('parseDirectiveStatement-weex', function() {
//     let source = `<view v-show="true"></view>`;

//     let callback = parseTemplate.parseDirectiveStatement;
//     let result = compileTemplate(source, 'weex', options, callback);
//     it('test-c-show-transform', function() {
//       // style后续会通过parseStyle接着进行解析；
//       expect(result).to.equal(`<view :style="_cmlStyleProxy(\'display:\'+(true?\'\':\'none\')+\';\'+(true?\'\':\'height:0px;width:0px;overflow:hidden\'))"></view>`)
//     });
//   });
//   describe('parseDirectiveStatement-wx-alipay-baidu', function() {
//     let source = `<view v-show="true"></view>`;

//     let callback = parseTemplate.parseDirectiveStatement;
//     let result_wx = compileTemplate(source, 'wx', options, callback);
//     let result_baidu = compileTemplate(source, 'baidu', options, callback);
//     let result_alipay = compileTemplate(source, 'alipay', options, callback);

//     it('test-class-transform', function() {
//       expect(result_wx).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
//       expect(result_baidu).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
//       expect(result_alipay).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
//     });
//   });

//   describe('parse-vue2wx-wx', function() {
//     var parser = require('../../src/index.js');
//     let source = `<component :is="currentComp" shrinkComponents="comp,comp1"></component>`;

//     let result = parser(source, 'wx', options);
//     it('component is', function() {
//       // cml语法下线解析成style后续会通过parseStyle接着进行解析；
//       expect(result.source).to.equal(`<comp1 wx:if="{{currentComp === \'comp1\'}}" v-bind:is="currentComp" shrinkComponents="comp,comp1" class=" cml-base cml-component  cml-base cml-comp  cml-base cml-comp1"></comp1>;\n<comp wx:if="{{currentComp === \'comp\'}}" v-bind:is="currentComp" shrinkComponents="comp,comp1" class=" cml-base cml-component  cml-base cml-comp  cml-base cml-comp1"></comp>`)
//     });
//   });


// })
