
// cml语法的单元测试


const babylon = require('babylon');
const traverse = require('@babel/traverse')["default"];
const generate = require('@babel/generator')["default"];
const parseTemplate = require('../../src/parser/index.js');
const expect = require('chai').expect;

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
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseTag;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-tag-transform', function() {
      expect(result).to.equal(`<div></div>`)
    });
  });
  // parseRefStatement:仅在所有的小程序端进行处理
  describe('parseRefStatement-wx-alipay-baidu', function() {
    let source = `<view ref="flag"></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseRefStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-ref-transform', function() {
      expect(result).to.equal(`<view id="flag" class="_cml_ref_lmc_"></view>`)
    });
  });
  // parseConditionalStatement
  describe('parseConditionalStatement-web-weex', function() {
    let source = `<view><view c-if="true"></view><view c-else-if="true"></view><view c-else="true"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseConditionalStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-condition-web-transform', function() {
      expect(result).to.equal(`<view><view v-if="true"></view><view v-else-if="true"></view><view v-else="true"></view></view>`)
    });
  });
  describe('parseConditionalStatement-wx', function() {
    let source = `<view><view c-if="true"></view><view c-else-if="true"></view><view c-else="true"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseConditionalStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-condition-wx-transform', function() {
      expect(result).to.equal(`<view><view wx:if="true"></view><view wx:elif="true"></view><view wx:else="true"></view></view>`)
    });
  });
  describe('parseConditionalStatement-alipay', function() {
    let source = `<view><view c-if="true"></view><view c-else-if="true"></view><view c-else="true"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseConditionalStatement;
    let result = compileTemplate(source, 'alipay', options, callback);
    it('test-condition-alipay-transform', function() {
      expect(result).to.equal(`<view><view a:if="true"></view><view a:elif="true"></view><view a:else="true"></view></view>`)
    });
  });
  describe('parseConditionalStatement-baidu', function() {
    let source = `<view><view c-if="true"></view><view c-else-if="true"></view><view c-else="true"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseConditionalStatement;
    let result = compileTemplate(source, 'baidu', options, callback);
    it('test-condition-baidu-transform', function() {
      expect(result).to.equal(`<view><view s-if="true"></view><view s-elif="true"></view><view s-else="true"></view></view>`)
    });
  });
  // parseEventListener
  describe('parseEventListener-web-weex', function() {
    let source = `<view><view c-bind:tap="tapHandle"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseEventListener;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-event-transform', function() {
      expect(result).to.equal(`<view><view v-on:click="_cmlEventProxy($event,'tapHandle')"></view></view>`)
    });
  });
  describe('parseEventListener-wx-baidu', function() {
    let source = `<view><view c-bind:tap="tapHandle"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseEventListener;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-event-transform', function() {
      expect(result).to.equal(`<view><view bindtap="_cmlEventProxy" data-eventtap="tapHandle"></view></view>`)
    });
  });
  describe('parseEventListener-alipay', function() {
    let source = `<view><view c-bind:tap="tapHandle"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseEventListener;
    let result = compileTemplate(source, 'alipay', options, callback);
    it('test-event-transform', function() {
      expect(result).to.equal(`<view><view onTap="_cmlEventProxy" data-eventtap="tapHandle"></view></view>`)
    });
  });
  // parseIterationStatement
  describe('parseIterationStatement-web-weex', function() {
    let source = `<view><view c-for="{{array}}"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseIterationStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-Iteration-transform', function() {
      expect(result).to.equal(`<view><view v-for="(item, index) in array"></view></view>`)
    });
  });
  describe('parseIterationStatement-wx-alipay', function() {
    let source = `<view><view c-for="{{array}}"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseIterationStatement;
    let result1 = compileTemplate(source, 'wx', options, callback);
    let result2 = compileTemplate(source, 'alipay', options, callback);
    it('test-Iteration-transform', function() {
      expect(result1).to.equal(`<view><view wx:for="{{array}}"></view></view>`)
      expect(result2).to.equal(`<view><view a:for="{{array}}"></view></view>`)
    });
  });
  describe('parseIterationStatement-baidu', function() {
    let source = `<view><view c-for="{{array}}"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseIterationStatement;
    let result = compileTemplate(source, 'baidu', options, callback);
    it('test-Iteration-transform', function() {
      expect(result).to.equal(`<view><view s-for="array"></view></view>`)
    });
  });
  // parseAttributeStatement
  describe('parseAttributeStatement-web-weex', function() {
    let source = `<view><view prop1="static" prop2="{{dynamic}}"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseAttributeStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-attribute-transform', function() {
      expect(result).to.equal(`<view><view prop1="static" :prop2="(dynamic)"></view></view>`)
    });
  });
  describe('parseAttributeStatement-miniapp', function() {
    let source = `<view><view prop1="static" prop2="{{dynamic}}"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseAttributeStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-attribute-transform', function() {
      expect(result).to.equal(`<view><view prop1="static" prop2="{{dynamic}}"></view></view>`)
    });
  });
  // cml语法下style只支持一个style；parseStyleStatement
  describe('parseStyleStatement-web', function() {
    let source = `<view style="{{dynamicColor}}"><view style="color:red"></view></view>`;
    let options = {lang: 'cml', cmss: {
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
    }};
    let callback = parseTemplate.parseStyleStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-style-transform', function() {
      expect(result).to.equal(`<view :style="_cmlStyleProxy(((dynamicColor)),{'rem':true,'scale':0.5,'remOptions':{'rootValue':75,'minPixelValue':1.01},'autoprefixOptions':{'browsers':['> 0.1%','ios >= 8','not ie < 12']}})"><view style="color:red"></view></view>`)
    });
  });
  describe('parseStyleStatement-weex', function() {
    let source = `<view style="{{dynamicColor}}"><view style="color:red;width:20px"></view></view>`;
    let options = {lang: 'cml', cmss: {
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
    }};
    let callback = parseTemplate.parseStyleStatement;
    let result = compileTemplate(source, 'weex', options, callback);
    it('test-style-transform', function() {
      expect(result).to.equal(`<view :style="_cmlStyleProxy(((dynamicColor)))"><view style="color: #ff0000;width: 20px"></view></view>`)
    });
  });
  describe('parseStyleStatement-miniapp', function() {
    let source = `<view style="{{dynamicColor}};width:{{num}}cpx"><view style="color:red;width:20px"></view></view>`;
    let options = {lang: 'cml', cmss: {
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
    }};
    let callback = parseTemplate.parseStyleStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-style-transform', function() {
      expect(result).to.equal(`<view style="{{dynamicColor}};width:{{num}}rpx"><view style="color:red;width:20px"></view></view>`)
    });
  });
  // parseClassStatement:cml语法下只能写一个class
  describe('parseClassStatement-web', function() {
    let source = `<view class="cls1 cls2"><view class="{{true?'cls3':'cls4'}}"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseClassStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view class="cls1 cls2  cml-base cml-view"><view v-bind:class="((true?'cls3':'cls4')+'  cml-base cml-view')"></view></view>`)
    });
  });
  describe('parseClassStatement-weex', function() {
    let source = `<view class="cls1 cls2"><view class="{{true?'cls3':'cls4'}}"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseClassStatement;
    let result = compileTemplate(source, 'weex', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view :class="_weexClassProxy('cls1 cls2  cml-base cml-view')"><view :class="_weexClassProxy((true?'cls3':'cls4')+'  cml-base cml-view')"></view></view>`)
    });
  });
  describe('parseClassStatement-wx-alipay-baidu', function() {
    let source = `<view class="cls1 cls2"><view class="{{true?'cls3':'cls4'}}"></view></view>`;
    let options = {lang: 'cml'};
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
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseAnimationStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view><view v-animation="anima"></view></view>`)
    });
  });
  describe('parseAnimationStatement-wx', function() {
    let source = `<view><view c-animation="anima"></view></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseAnimationStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view><view animation="anima"></view></view>`)
    });
  });
  // parseDirectiveStatement:c-model
  describe('parseDirectiveStatement-web-weex', function() {
    let source = `<view><input c-model="{{searchText}}" /><custom-input c-model="{{search}}"></custom-input></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-class-transform', function() {
      expect(result).to.equal(`<view><input v-on:input="_cmlModelEventProxy($event,'searchText')" v-bind:value="searchText" /><custom-input v-on:input="_cmlModelEventProxy($event,'search')" v-bind:value="search"></custom-input></view>`)
    });
  });
  describe('parseDirectiveStatement-wx-alipay-baidu', function() {
    let source = `<view><input c-model="{{searchText}}" /><custom-input c-model="{{search}}"></custom-input></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseDirectiveStatement;
    let result_wx = compileTemplate(source, 'wx', options, callback);
    let result_baidu = compileTemplate(source, 'baidu', options, callback);
    let result_alipay = compileTemplate(source, 'alipay', options, callback);
    it('test-class-transform', function() {
      expect(result_wx).to.equal(`<view><input data-modelkey="searchText" bindinput="_cmlModelEventProxy" value="{{searchText}}" /><custom-input data-modelkey="search" bindinput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
      expect(result_baidu).to.equal(`<view><input data-modelkey="searchText" bindinput="_cmlModelEventProxy" value="{{searchText}}" /><custom-input data-modelkey="search" bindinput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
      expect(result_alipay).to.equal(`<view><input data-modelkey="searchText" bindInput="_cmlModelEventProxy" value="{{searchText}}" /><custom-input data-modelkey="search" bindInput="_cmlModelEventProxy" value="{{search}}"></custom-input></view>`)
    });
  });
  // c-show
  describe('parseDirectiveStatement-web', function() {
    let source = `<view c-show="{{true}}"></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'web', options, callback);
    it('test-c-show-transform', function() {
      // cml语法下线解析成style后续会通过parseStyle接着进行解析；
      expect(result).to.equal(`<view v-show="true"></view>`)
    });
  });
  describe('parseDirectiveStatement-weex', function() {
    let source = `<view c-show="{{true}}"></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseDirectiveStatement;
    let result = compileTemplate(source, 'weex', options, callback);
    it('test-c-show-transform', function() {
      // cml语法下线解析成style后续会通过parseStyle接着进行解析；
      expect(result).to.equal(`<view style="display:{{true?\'\':\'none\'}};{{true?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></view>`)
    });
  });
  describe('parseDirectiveStatement-wx-alipay-baidu', function() {
    let source = `<view c-show="{{true}}"></view>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseDirectiveStatement;
    let result_wx = compileTemplate(source, 'wx', options, callback);
    let result_baidu = compileTemplate(source, 'baidu', options, callback);
    let result_alipay = compileTemplate(source, 'alipay', options, callback);

    it('test-class-transform', function() {
      expect(result_wx).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
      expect(result_baidu).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
      expect(result_alipay).to.equal(`<view style="display:{{true?'':'none'}};{{true?'':'height:0px;width:0px;overflow:hidden'}}"></view>`)
    });
  });

  describe('parse-vue2wx-wx', function() {
    let source = `<component is="{{comp}}" shrinkComponents="comp,comp1"></component>`;
    let options = {lang: 'cml'};
    let callback = parseTemplate.parseVue2WxStatement;
    let result = compileTemplate(source, 'wx', options, callback);
    it('component is', function() {
      // cml语法下线解析成style后续会通过parseStyle接着进行解析；
      expect(result).to.equal(`<comp1 wx:if="{{comp === \'comp1\'}}" is="{{comp}}" shrinkComponents="comp,comp1"></comp1>;\n<comp wx:if="{{comp === \'comp\'}}" is="{{comp}}" shrinkComponents="comp,comp1"></comp>`)
    });
  });

})
