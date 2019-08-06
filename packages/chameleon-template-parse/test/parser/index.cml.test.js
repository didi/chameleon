
// cml单个语法的单元测试


const babylon = require('babylon');
const traverse = require('@babel/traverse')["default"];
const generate = require('@babel/generator')["default"];
const parseTemplate = require('../../src/parser/index.js');
const expect = require('chai').expect;
let options = {lang: 'cml',
  buildInComponents: {button: "cml-buildin-button"},
  filePath: '/User/Jim-W/didi/component/button.cml',
  isInjectBaseStyle: true,
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
function compileTemplate(source, type, options, callback) {

  const ast = babylon.parse(source, {
    plugins: ['jsx']
  })
  traverse(ast, {
    enter(path) {
      callback(path, type, options);
    }
  });
  let result = generate(ast).code;
  if (/;$/.test(result)) { // 这里有个坑，jsx解析语法的时候，默认解析的是js语法，所以会在最后多了一个 ; 字符串；但是在 html中 ; 是无法解析的；
    result = result.slice(0, -1);
  }

  return result;
}
// cml语法的单元测试
describe('parse-template-cml', function() {
  // parseTag
  describe('parseTag', function() { // 各个端的标签转化单元测试不做全覆盖，逻辑相对简单
    let source = `<view></view>`;

    let callback = parseTemplate.parseTag;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-tag-transform', function() {
      expect(result).to.equal(`<div></div>`)
    });
  });
  describe('afterParseTag', function() { // 各个端的标签转化单元测试不做全覆盖，逻辑相对简单
    let source = `<block></block>`;

    let callback = parseTemplate.afterParseTag;
    it('test-after-tag-transform-web-weex', function() {
      expect(compileTemplate(source, 'web', options, callback)).to.equal(`<template></template>`)
    });
    it('test-after-tag-transform-miniapp', function() {
      expect(compileTemplate(source, 'wx', options, callback)).to.equal(`<block></block>`)
    });
  });
  describe('parseBuildTag', function() { // 各个端的标签转化单元测试不做全覆盖，逻辑相对简单
    let source = `<button></button>`;

    let callback = parseTemplate.parseBuildTag;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-build-tag-transform', function() {
      expect(result).to.equal(`<cml-buildin-button></cml-buildin-button>`)
    });
  });
  // wx baidu alipay一样
  describe('parseTagForSlider', function() {
    let source = `<carousel><carousel-item></carousel-item></carousel>`;

    let callback = parseTemplate.parseTagForSlider;
    let result = compileTemplate(source, 'wx', options, callback);
    it('parseTagForSlider for wx', function() {
      expect(result).to.equal(`<swiper><swiper-item></swiper-item></swiper>`)
    });
  });
  // parseRefStatement:仅在所有的小程序端进行处理
  describe('parseRefStatement-wx-alipay-baidu', function() {
    let source = `<view ref="flag"></view>`;

    let callback = parseTemplate.parseRefStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-ref-transform', function() {
      expect(result).to.equal(`<view id="flag" class="_cml_ref_lmc_"></view>`)
    });
  });
  // parseConditionalStatement
  describe('parseConditionalStatement-web-weex', function() {
    let source = `<view><view c-if="{{value1}}"></view><view c-else-if="{{value2}}"></view><view c-else></view></view>`;

    let callback = parseTemplate.parseConditionalStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-condition-web-transform', function() {
      expect(result).to.equal(`<view><view v-if="value1"></view><view v-else-if="value2"></view><view v-else></view></view>`)
    });
  });
  describe('parseConditionalStatement-wx', function() {
    let source = `<view><view c-if="{{value1}}"></view><view c-else-if="{{value2}}"></view><view c-else></view></view>`;

    let callback = parseTemplate.parseConditionalStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-condition-wx-transform', function() {
      expect(result).to.equal(`<view><view wx:if="{{value1}}"></view><view wx:elif="{{value2}}"></view><view wx:else></view></view>`)
    });
  });
  describe('parseConditionalStatement-alipay', function() {
    let source = `<view><view c-if="{{value1}}"></view><view c-else-if="{{value2}}"></view><view c-else></view></view>`;

    let callback = parseTemplate.parseConditionalStatement;
    let result = compileTemplate(source, 'alipay', options, callback);
    it('test-condition-alipay-transform', function() {
      expect(result).to.equal(`<view><view a:if="{{value1}}"></view><view a:elif="{{value2}}"></view><view a:else></view></view>`)
    });
  });
  describe('parseConditionalStatement-baidu', function() {
    let source = `<view><view c-if="{{value1}}"></view><view c-else-if="{{value2}}"></view><view c-else></view></view>`;

    let callback = parseTemplate.parseConditionalStatement;
    let result = compileTemplate(source, 'baidu', options, callback);
    console.log('condition-baidu', result)
    it('test-condition-baidu-transform', function() {
      expect(result).to.equal(`<view><view s-if="value1"></view><view s-elif="value2"></view><view s-else></view></view>`)
    });
  });
  // parseEventListener
  describe('parseEventListener-web-weex', function() {
    let source = `<view><view c-bind:tap="tapHandle"></view></view>`;
    let originSource = `<view><origin-tag c-bind:click="handleClick"></origin-tag><thirdComp1 c-bind:click="handleClick"></thirdComp1><thirdComp2 c-bind:click="handleClick"></thirdComp2></view>  `

    let callback = parseTemplate.parseEventListener;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-event-transform', function() {
      expect(result).to.equal(`<view><view v-on:tap="_cmlEventProxy($event,'tapHandle',false)"></view></view>`)
    });
    // 原生组件事件不进行代理
    it('test-origin-tag-event-transform', function() {
      expect(compileTemplate(originSource, 'web', options, callback)).to.equal(`<view><origin-tag v-on:click="handleClick"></origin-tag><thirdComp1 v-on:click="handleClick"></thirdComp1><thirdComp2 v-on:click__CML_NATIVE_EVENTS__="_cmlEventProxy($event,'handleClick',false)"></thirdComp2></view>`)
    });
  });
  describe('parseEventListener-wx-baidu', function() {
    let source = `<view><view c-bind:tap="tapHandle"></view></view>`;
    let originSource = `<view><origin-tag c-bind:click="handleClick"></origin-tag><thirdComp1 c-bind:click="handleClick"></thirdComp1><thirdComp2 c-bind:click="handleClick"></thirdComp2></view>  `

    let callback = parseTemplate.parseEventListener;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-event-transform', function() {
      expect(result).to.equal(`<view><view bindtap="_cmlEventProxy" data-eventtap="{{['tapHandle']}}"></view></view>`)
    });
    it('test-origin-tag-event-transform', function() {
      expect(compileTemplate(originSource, 'wx', options, callback)).to.equal(`<view><origin-tag bindtap="handleClick"></origin-tag><thirdComp1 bindtap="handleClick"></thirdComp1><thirdComp2 bindtap="_cmlEventProxy" data-eventtap="{{['handleClick']}}"></thirdComp2></view>`)
    });
  });
  describe('parseEventListener-alipay', function() {
    let source = `<view><view c-bind:tap="tapHandle"></view></view>`;
    let originSource = `<view><origin-tag c-bind:click="handleClick"></origin-tag><thirdComp1 c-bind:click="handleClick"></thirdComp1><thirdComp2 c-bind:click="handleClick"></thirdComp2></view>  `

    let callback = parseTemplate.parseEventListener;
    let result = compileTemplate(source, 'alipay', options, callback);
    it('test-event-transform', function() {
      expect(result).to.equal(`<view><view onTap="_cmlEventProxy" data-eventtap="{{['tapHandle']}}"></view></view>`)
    });
    it('test-origin-tag-event-transform', function() {
      expect(compileTemplate(originSource, 'alipay', options, callback)).to.equal(`<view><origin-tag onTap="handleClick"></origin-tag><thirdComp1 onTap="handleClick"></thirdComp1><thirdComp2 onTap="_cmlEventProxy" data-eventtap="{{['handleClick']}}"></thirdComp2></view>`)
    });
  });
  // parseIterationStatement
  describe('parseIterationStatement-web-weex', function() {
    let source = `<view><view c-for="{{array}}"></view></view>`;

    let callback = parseTemplate.parseIterationStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-Iteration-transform', function() {
      expect(result).to.equal(`<view><view v-for="(item, index) in array"></view></view>`)
    });
  });
  describe('parseIterationStatement-wx', function() {
    let source = `<view><view c-for="{{array}}"></view></view>`;

    let callback = parseTemplate.parseIterationStatement;
    let result1 = compileTemplate(source, 'wx', options, callback);
    it('test-Iteration-transform', function() {
      expect(result1).to.equal(`<view><view wx:for="{{array}}"></view></view>`)
    });
  });
  describe('parseIterationStatement-alipay', function() {
    let source = `<view><view c-for="{{array}}"></view></view>`;

    let callback = parseTemplate.parseIterationStatement;
    let result2 = compileTemplate(source, 'alipay', options, callback);
    it('test-Iteration-transform', function() {
      expect(result2).to.equal(`<view><view a:for="{{array}}"></view></view>`)
    });
  });
  describe('parseIterationStatement-baidu', function() {
    let source = `<view><view c-for="{{array}}"></view></view>`;

    let callback = parseTemplate.parseIterationStatement;
    let result = compileTemplate(source, 'baidu', options, callback);
    it('test-Iteration-transform', function() {
      expect(result).to.equal(`<view><view s-for="array"></view></view>`)
    });
  });
  // parseIterationStatement c-for-inde c-for-item c-key的测试
  describe('parseIterationStatement-web-weex', function() {
    let source = `<view><view c-for="{{array}}" c-for-index="idx" c-for-item="item" c-key="id"></view></view>`;

    let callback = parseTemplate.parseIterationStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-Iteration-transform', function() {
      expect(result).to.equal(`<view><view v-for="(item, idx) in array" :key="item.id"></view></view>`)
    });
  });
  describe('parseIterationStatement-wx', function() {
    let source = `<view><view c-for="{{array}}" c-for-index="idx" c-for-item="item" c-key="id"></view></view>`;

    let callback = parseTemplate.parseIterationStatement;
    let result1 = compileTemplate(source, 'wx', options, callback);
    it('test-Iteration-transform', function() {
      expect(result1).to.equal(`<view><view wx:for="{{array}}" wx:for-index="idx" wx:for-item="item" wx:key="id"></view></view>`)
    });
  });
  describe('parseIterationStatement-alipay', function() {
    let source = `<view><view c-for="{{array}}" c-for-index="idx" c-for-item="item" c-key="id"></view></view>`;

    let callback = parseTemplate.parseIterationStatement;
    let result2 = compileTemplate(source, 'alipay', options, callback);
    it('test-Iteration-transform', function() {
      expect(result2).to.equal(`<view><view a:for="{{array}}" a:for-index="idx" a:for-item="item" a:key="id"></view></view>`)
    });
  });
  describe('parseIterationStatement-baidu', function() {
    let source = `<view><view c-for="{{array}}" c-for-index="idx" c-for-item="item" c-key="id"></view></view>`;

    let callback = parseTemplate.parseIterationStatement;
    let result = compileTemplate(source, 'baidu', options, callback);
    it('test-Iteration-transform', function() {
      expect(result).to.equal(`<view><view s-for="array" s-for-index="idx" s-for-item="item" s-key="id"></view></view>`)
    });
  });
  // parseAttributeStatement
  describe('parseAttributeStatement-web-weex', function() {
    let source = `<view><view prop1="static" prop2="{{dynamic}}"></view></view>`;

    let callback = parseTemplate.parseAttributeStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-attribute-transform', function() {
      expect(result).to.equal(`<view><view prop1="static" :prop2="(dynamic)"></view></view>`)
    });
  });
  describe('parseAttributeStatement-miniapp', function() {
    let source = `<view><view prop1="static" prop2="{{dynamic}}"></view></view>`;

    let callback = parseTemplate.parseAttributeStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-attribute-transform', function() {
      expect(result).to.equal(`<view><view prop1="static" prop2="{{dynamic}}"></view></view>`)
    });
  });
  // cml语法下style只支持一个style；parseStyleStatement
  describe('parseStyleStatement-web', function() {
    let source = `<view style="{{dynamicColor}}"><view style="color:red"></view></view>`;

    let callback = parseTemplate.parseStyleStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-style-transform', function() {
      expect(result).to.equal(`<view :style="_cmlStyleProxy(((dynamicColor)),{'rem':true,'scale':0.5,'remOptions':{'rootValue':75,'minPixelValue':1.01},'autoprefixOptions':{'browsers':['> 0.1%','ios >= 8','not ie < 12']}})"><view style="color:red"></view></view>`)
    });
  });
  describe('parseStyleStatement-weex', function() {
    let source = `<view style="{{dynamicColor}}"><view style="color:red;width:20px"></view></view>`;

    let callback = parseTemplate.parseStyleStatement;
    let result = compileTemplate(source, 'weex', options, callback);
    it('test-style-transform', function() {
      expect(result).to.equal(`<view :style="_cmlStyleProxy(((dynamicColor)))"><view style="color: #ff0000;width: 20px"></view></view>`)
    });
  });
  describe('parseStyleStatement-miniapp', function() {
    let source = `<view style="{{dynamicColor}};width:{{num}}cpx"><view style="color:red;width:20px"></view></view>`;

    let callback = parseTemplate.parseStyleStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-style-transform', function() {
      expect(result).to.equal(`<view style="{{dynamicColor}};width:{{num}}rpx"><view style="color:red;width:20px"></view></view>`)
    });
  });
  // parseClassStatement:cml语法下只能写一个class
  describe('parseClassStatement-web', function() {
    let source = `<view class="cls1 cls2"><view class="{{true?'cls3':'cls4'}}"></view></view>`;

    let callback = parseTemplate.parseClassStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view class="cls1 cls2  cml-base cml-view"><view v-bind:class="((true?'cls3':'cls4')+'  cml-base cml-view')"></view></view>`)
    });
  });
  describe('parseClassStatement-weex', function() {
    let source = `<view class="cls1 cls2"><view class="{{true?'cls3':'cls4'}}"></view></view>`;

    let callback = parseTemplate.parseClassStatement;
    let result = compileTemplate(source, 'weex', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view :class="_weexClassProxy('cls1 cls2  cml-base cml-view')"><view :class="_weexClassProxy((true?'cls3':'cls4')+'  cml-base cml-view')"></view></view>`)
    });
  });
  describe('parseClassStatement-wx-alipay-baidu', function() {
    let source = `<view class="cls1 cls2"><view class="{{true?'cls3':'cls4'}}"></view></view>`;

    let callback = parseTemplate.parseClassStatement;
    let result_wx = compileTemplate(source, 'wx', options, callback);
    let result_alipay = compileTemplate(source, 'wx', options, callback);
    let result_baidu = compileTemplate(source, 'wx', options, callback);
    it('test-class-transform', function() {
      expect(result_wx).to.equal(`<view class="cls1 cls2  cml-base cml-view"><view class="{{true?'cls3':'cls4'}}  cml-base cml-view"></view></view>`)
      expect(result_alipay).to.equal(`<view class="cls1 cls2  cml-base cml-view"><view class="{{true?'cls3':'cls4'}}  cml-base cml-view"></view></view>`)
      expect(result_baidu).to.equal(`<view class="cls1 cls2  cml-base cml-view"><view class="{{true?'cls3':'cls4'}}  cml-base cml-view"></view></view>`)
    });
  });
  // parseAnimationStatement
  describe('parseAnimationStatement-web-weex', function() {
    let source = `<view><view c-animation="anima"></view></view>`;

    let callback = parseTemplate.parseAnimationStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view><view v-animation="anima"></view></view>`)
    });
  });
  describe('parseAnimationStatement-wx', function() {
    let source = `<view><view c-animation="anima"></view></view>`;

    let callback = parseTemplate.parseAnimationStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view><view animation="anima"></view></view>`)
    });
  });
  // parseDirectiveStatement:c-model
  describe('parseDirectiveStatement-web-weex', function() {
    let source = `<view><input c-model="{{ searchText }}" /><custom-input c-model="{{ search }}"></custom-input></view>`;

    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view><input v-on:input="_cmlModelEventProxy($event,'searchText')" v-bind:value="searchText" /><custom-input v-on:input="_cmlModelEventProxy($event,'search')" v-bind:value="search"></custom-input></view>`)
    });
  });
  describe('parseDirectiveStatement-wx', function() {
    let source = `<view><input c-model="{{searchText}}" /><custom-input c-model="{{search}}"></custom-input></view>`;

    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('parseDirectiveStatement-c-model-wx', function() {
      expect(result).to.equal(`<view><input data-modelkey="searchText" bindinput="_cmlModelEventProxy" value="{{searchText}}" /><custom-input data-modelkey="search" bindinput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
    });
  });
  describe('parseDirectiveStatement-alipay', function() {
    let source = `<view><input c-model="{{searchText}}" /><custom-input c-model="{{search}}"></custom-input></view>`;

    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'alipay', options, callback);
    it('parseDirectiveStatement-c-model-alipay', function() {
      expect(result).to.equal(`<view><input data-modelkey="searchText" data-eventinput="_cmlModelEventProxy" onInput="_cmlModelEventProxy" value="{{searchText}}" /><custom-input data-modelkey="search" data-eventinput="_cmlModelEventProxy" onInput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
    });
  });
  describe('parseDirectiveStatement-baidu', function() {
    let source = `<view><input c-model="{{searchText}}" /><custom-input c-model="{{search}}"></custom-input></view>`;

    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'baidu', options, callback);
    it('parseDirectiveStatement-c-model-baidu', function() {
      expect(result).to.equal(`<view><input data-modelkey="searchText" bindinput="_cmlModelEventProxy" value="{{searchText}}" /><custom-input data-modelkey="search" bindinput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
    });
  });
  // c-show
  describe('parseDirectiveStatement-web', function() {
    let source = `<view c-show="{{true}}"></view>`;

    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-c-show-transform', function() {
      // cml语法下线解析成style后续会通过parseStyle接着进行解析；
      expect(result).to.equal(`<view v-show="true"></view>`)
    });
  });
  describe('parseDirectiveStatement-weex', function() {
    let source = `<view c-show="{{true}}"></view>`;

    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'weex', options, callback);
    it('test-c-show-transform', function() {
      // cml语法下线解析成style后续会通过parseStyle接着进行解析；
      expect(result).to.equal(`<view style="display:{{true?\'\':\'none\'}};{{true?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></view>`)
    });
  });
  describe('parseDirectiveStatement-wx-alipay-baidu', function() {
    let source = `<view c-show="{{true}}"></view>`;

    let callback = parseTemplate.parseDirectiveStatement;
    let result_wx = compileTemplate(source, 'wx', options, callback);
    let result_baidu = compileTemplate(source, 'baidu', options, callback);
    let result_alipay = compileTemplate(source, 'alipay', options, callback);

    it('test-c-show-transform', function() {
      expect(result_wx).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
      expect(result_baidu).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
      expect(result_alipay).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
    });
  });
  // c-text
  describe('parseDirectiveStatement-web-miniapp', function() {
    let source = `<view c-text="{{value1}}">everything will be replaced</view>`;

    let callback = parseTemplate.parseDirectiveStatement;
    it('test-c-text-transform', function() {
      expect(compileTemplate(source, 'web', options, callback)).to.equal(`<view>{{value1}}</view>`)
    });
    it('test-c-text-transform', function() {
      expect(compileTemplate(source, 'wx', options, callback)).to.equal(`<view>{{value1}}</view>`)
    });
    it('test-c-text-transform', function() {
      expect(compileTemplate(source, 'weex', options, callback)).to.equal(`<view>{{value1}}</view>`)
    });
  });
  describe('parse-vue2wx-wx', function() {
    let source = `<component is="{{comp}}" shrinkcomponents="comp,comp1"></component>`;

    let callback = parseTemplate.parseVue2WxStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('component is', function() {
      // cml语法下线解析成style后续会通过parseStyle接着进行解析；
      expect(result).to.equal(`<comp1 wx:if="{{comp === \'comp1\'}}" is="{{comp}}" shrinkcomponents="comp,comp1"></comp1>;\n<comp wx:if="{{comp === \'comp\'}}" is="{{comp}}" shrinkcomponents="comp,comp1"></comp>`)
    });
  });
  describe('parse-vue2wx-baidu', function() {
    let source = `<component is="{{comp}}" shrinkcomponents="comp,comp1"></component>`;

    let callback = parseTemplate.parseVue2WxStatement;
    let result = compileTemplate(source, 'baidu', options, callback);
    it('component is', function() {
      expect(result).to.equal(`<comp1 s-if="{{comp === \'comp1\'}}" is="{{comp}}" shrinkcomponents="comp,comp1"></comp1>;\n<comp s-if="{{comp === \'comp\'}}" is="{{comp}}" shrinkcomponents="comp,comp1"></comp>`)
    });
  });
  describe('parse-vue2wx-alipay', function() {
    let source = `<component is="{{comp}}" shrinkcomponents="comp,comp1"></component>`;

    let callback = parseTemplate.parseVue2WxStatement;
    let result = compileTemplate(source, 'alipay', options, callback);
    it('component is', function() {
      expect(result).to.equal(`<comp1 a:if="{{comp === \'comp1\'}}" is="{{comp}}" shrinkcomponents="comp,comp1"></comp1>;\n<comp a:if="{{comp === \'comp\'}}" is="{{comp}}" shrinkcomponents="comp,comp1"></comp>`)
    });
  });

})
