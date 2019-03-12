// cml 或者vue语法整体单元测试
const compileTemplate = require('../../src/index.js');
const expect = require('chai').expect;

let options = {lang: 'cml',
  buildInComponents: {button: "cml-buildin-button"},
  filePath: '/User/Jim-W/didi/component/button.cml',
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
describe('parse-template-cml-all', function() {
  // parseTag
  describe('parse-tag-transform', function() {
    let source = `<view><button></button><thirdComp1></thirdComp1><thirdComp2></thirdComp2></view>`;
    it('test-tag-transform', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button"></cml-buildin-button><thirdComp1 class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button"></cml-buildin-button><thirdComp1 class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 class=" cml-view cml-thirdComp2"></thirdComp2></view>`)
    });
  });
  // directive c-model
  describe('parse-directive-transform', function() {
    let source = `<view><button c-model="{{  value1}}"></button></view>`;
    it('test-directive-comodel-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-on:input="_cmlModelEventProxy($event,\'value1\')" v-bind:value="value1" class=" cml-base cml-button"></cml-buildin-button></div>`);
    });
    it('test-directive-comodel-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-on:input="_cmlModelEventProxy($event,\'value1\')" v-bind:value="value1" class=" cml-base cml-button"></cml-buildin-button></div>`)
    });
    it('test-directive-comodel-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button data-modelkey="value1" bindinput="_cmlModelEventProxy" value="{{  value1}}" class=" cml-base cml-button"></cml-buildin-button></view>`)
    });
    it('test-directive-comodel-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view class=" cml-base cml-view cml-5766bf8a"><cml-buildin-button data-modelkey="value1" data-eventinput="_cmlModelEventProxy" onInput="_cmlModelEventProxy" value="{{  value1}}" class=" cml-base cml-button cml-5766bf8a"></cml-buildin-button></view></view>`)
    });
    it('test-directive-comodel-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button data-modelkey="value1" bindinput="_cmlModelEventProxy" value="{{  value1}}" class=" cml-base cml-button"></cml-buildin-button></view>`)
    });
  });
  // directive c-show
  describe('parse-directive-transform', function() {
    let source = `<view><button c-show="{{  value1}}"></button></view>`;
    it('test-directive-c-show-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" v-show="  value1"></cml-buildin-button></div>`);
    });
    it('test-directive-c-show-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" v-bind:style="_cmlStyleProxy((\'display:\'+(  value1?\'\':\'none\')+\';\'+(  value1?\'\':\'height:0px;width:0px;overflow:hidden\')))"></cml-buildin-button></div>`)
    });
    it('test-directive-c-show-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" style="display:{{value1 ? \'\' : \'none\'}};{{value1 ? \'\' : \'height:0px;width:0px;overflow:hidden\'}}"></cml-buildin-button></view>`)
    });
    it('test-directive-c-show-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view class=" cml-base cml-view cml-5766bf8a" style="display:{{value1 ? \'\' : \'none\'}};{{value1 ? \'\' : \'height:0px;width:0px;overflow:hidden\'}}"><cml-buildin-button class=" cml-base cml-button cml-5766bf8a" style="display:{{value1 ? \'\' : \'none\'}};{{value1 ? \'\' : \'height:0px;width:0px;overflow:hidden\'}}"></cml-buildin-button></view></view>`)
    });
    it('test-directive-c-show-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" style="display:{{value1 ? \'\' : \'none\'}};{{value1 ? \'\' : \'height:0px;width:0px;overflow:hidden\'}}"></cml-buildin-button></view>`)
    });
  });
  // directive c-text
  describe('parse-directive-transform', function() {
    let source = `<view><button c-text="{{  value1}}"></button></view>`;
    it('test-directive-c-text-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></div>`);
    });
    it('test-directive-c-text-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></div>`)
    });
    it('test-directive-c-text-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></view>`)
    });
    it('test-directive-c-text-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view class=" cml-base cml-view cml-5766bf8a"><cml-buildin-button class=" cml-base cml-button cml-5766bf8a">{{value1}}</cml-buildin-button></view></view>`)
    });
    it('test-directive-c-text-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></view>`)
    });
  });
  // directive c-if  c-else-if  c-else
  describe('parse-directive-transform', function() {
    let source = `<view><button c-if="{{  value1}}"></button>
    <view c-else-if="{{  value1}}"></view>
    <view c-else="{{  value1}}"></view></view>`;
    it('test-directive-c-condition-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-if="  value1" class=" cml-base cml-button"></cml-buildin-button>\n    <div v-else-if="  value1" class=" cml-base cml-view"></div>\n    <div v-else="  value1" class=" cml-base cml-view"></div></div>`);
    });
    it('test-directive-c-condition-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-if="  value1" class=" cml-base cml-button"></cml-buildin-button>\n    <div v-else-if="  value1" class=" cml-base cml-view"></div>\n    <div v-else="  value1" class=" cml-base cml-view"></div></div>`)
    });
    it('test-directive-c-condition-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button wx:if="{{  value1}}" class=" cml-base cml-button"></cml-buildin-button>\n    <view wx:elif="{{  value1}}" class=" cml-base cml-view"></view>\n    <view wx:else="{{  value1}}" class=" cml-base cml-view"></view></view>`)
    });
    it('test-directive-c-condition-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view a:if="{{  value1}}" class=" cml-base cml-view cml-5766bf8a"><cml-buildin-button class=" cml-base cml-button cml-5766bf8a"></cml-buildin-button></view>\n    <view a:elif="{{  value1}}" class=" cml-base cml-view cml-5766bf8a"></view>\n    <view a:else="{{  value1}}" class=" cml-base cml-view cml-5766bf8a"></view></view>`)
    });
    it('test-directive-c-condition-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button s-if="  value1" class=" cml-base cml-button"></cml-buildin-button>\n    <view s-elif="  value1" class=" cml-base cml-view"></view>\n    <view s-else="  value1" class=" cml-base cml-view"></view></view>`)
    });
  });
  // directive c-for  c-for-index  c-for-item c-key
  describe('parse-c-interation-transform', function() {
    let source = `<view><view c-for="{{array}}">{{item.id}}  </view></view>`;
    it('test-directive-c-interator-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item, index) in array" class=" cml-base cml-view">{{item.id}}  </div></div>`);
    });
    it('test-directive-c-interator-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item, index) in array" class=" cml-base cml-view">{{item.id}}  </div></div>`)
    });
    it('test-directive-c-interator-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><view wx:for="{{array}}" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-c-interator-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view a:for="{{array}}" class=" cml-base cml-view cml-5766bf8a">{{item.id}}  </view></view>`)
    });
    it('test-directive-c-interator-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><view s-for="array" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
  });
  // directive c-for  c-for-index  c-for-item c-key
  describe('parse-directive-transform', function() {
    let source = `<view><view c-for="{{array}}" c-key="id">{{item.id}}  </view></view>`;
    it('test-directive-c-interator-key-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item, index) in array" v-bind:key="item.id" class=" cml-base cml-view">{{item.id}}  </div></div>`);
    });
    it('test-directive-c-interator-key-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item, index) in array" v-bind:key="item.id" class=" cml-base cml-view">{{item.id}}  </div></div>`)
    });
    it('test-directive-c-interator-key-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><view wx:for="{{array}}" wx:key="id" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-c-interator-key-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view a:for="{{array}}" a:key="id" class=" cml-base cml-view cml-5766bf8a">{{item.id}}  </view></view>`)
    });
    it('test-directive-c-interator-key-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><view s-for="array" s-key="id" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
  });
  // directive c-for  c-for-index  c-for-item c-key:*this
  describe('parse-directive-transform', function() {
    let source = `<view><view c-for="{{array}}" c-key="*this">{{item.id}}  </view></view>`;
    it('test-directive-c-interator-*this-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item, index) in array" v-bind:key="index" class=" cml-base cml-view">{{item.id}}  </div></div>`);
    });
    it('test-directive-c-interator-*this-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item, index) in array" v-bind:key="index" class=" cml-base cml-view">{{item.id}}  </div></div>`)
    });
    it('test-directive-c-interator-*this-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><view wx:for="{{array}}" wx:key="*this" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-c-interator-*this-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view a:for="{{array}}" a:key="*this" class=" cml-base cml-view cml-5766bf8a">{{item.id}}  </view></view>`)
    });
    it('test-directive-c-interator-*this-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><view s-for="array" s-key="*this" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
  });
  // parseEvent
  describe('parse-event-transform', function() {
    let source = `<view><origin-tag c-bind:tap="handleClick"></origin-tag><thirdComp1 c-bind:tap="handleClick(1,item,'str')"></thirdComp1><thirdComp2 c-bind:tap="handleClick(1,item,'str')"></thirdComp2></view>`;
    it('test-event-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click="_cmlInlineStatementEventProxy(\'handleClick\',false,1,item,\'str\')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
    it('test-event-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click="_cmlInlineStatementEventProxy(\'handleClick\',false,1,item,\'str\')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
    it('test-event-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><tag bindtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 bindtap="handleClick(1,item,\'str\')" class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 bindtap="_cmlInlineStatementEventProxy" data-arg2="str" data-arg1="{{item}}" data-arg0="{{1}}" data-args="1,item,\'str\'" data-eventtap="handleClick" class=" cml-view cml-thirdComp2"></thirdComp2></view>`);
    });
    it('test-event-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><tag onTap="handleClick" class=" cml-base cml-origin-tag cml-5766bf8a"></tag><view class=" cml-base cml-view cml-5766bf8a"><thirdComp1 onTap="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1 cml-5766bf8a"></thirdComp1></view><view class=" cml-base cml-view cml-5766bf8a"><thirdComp2 onTap="_cmlInlineStatementEventProxy" data-arg2="str" data-arg1="{{item}}" data-arg0="{{1}}" data-args="1,item,\'str\'" data-eventtap="handleClick" class=" cml-base cml-thirdComp2 cml-5766bf8a"></thirdComp2></view></view>`);
    });
    it('test-event-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><tag bindtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 bindtap="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 bindtap="_cmlInlineStatementEventProxy" data-arg2="str" data-arg1="{{item}}" data-arg0="{{1}}" data-args="1,item,\'str\'" data-eventtap="handleClick" class=" cml-base cml-thirdComp2"></thirdComp2></view>`);
    });
  });
  // parseEvent-stop
  describe('parse-event-transform-stop', function() {
    let source = `<view><origin-tag c-catch:tap="handleClick"></origin-tag><thirdComp1 c-catch:tap="handleClick(1,item,'str')"></thirdComp1><thirdComp2 c-catch:tap="handleClick(1,item,'str')"></thirdComp2></view>`;
    it('test-event-transform-web-stop', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click="_cmlInlineStatementEventProxy(\'handleClick\',true,1,item,\'str\')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
    it('test-event-transform-weex-stop', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click="_cmlInlineStatementEventProxy(\'handleClick\',false,1,item,\'str\')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
  });
  // class
  describe('parse-class-transform', function() {
    let source = `<view><button class="cls1 {{true ? 'cls2':'cls3'}}"></button><thirdComp1 class="cls4"></thirdComp1></view>`;
    it('parse-class-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:class="(\'cls1 \'+(true ? \'cls2\':\'cls3\')+\'  cml-base cml-button\')"></cml-buildin-button><thirdComp1 class="cls4  cml-base cml-thirdComp1"></thirdComp1></div>`);
    });
    it('parse-class-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:class="_weexClassProxy(\'cls1 \'+(true ? \'cls2\':\'cls3\')+\'  cml-base cml-button\')"></cml-buildin-button><thirdComp1 v-bind:class="_weexClassProxy(\'cls4  cml-base cml-thirdComp1\')"></thirdComp1></div>`);
    });
    // wx baidu alipay
    it('parse-class-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class="cls1 {{true ? \'cls2\':\'cls3\'}}  cml-base cml-button"></cml-buildin-button><thirdComp1 class="cls4  cml-view cml-thirdComp1"></thirdComp1></view>`);
    });
  });
  // style 以及 miniappp端cpx动态测试
  describe('parse-style-transform', function() {
    let source = `<view><button style="width:{{cpx}}cpx;height:100cpx;border-width:200cpx;{{'width:'+cpx+'cpx'}}"></button><thirdComp1 style="{{'width:'+cpx+'cpx;'+'height:'+cpx2+'cpx;background-color:red'}}"></thirdComp1></view>`;
    it('parse-style-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:style="_cmlStyleProxy((\'width:\'+(cpx)+\'cpx;height:100cpx;border-width:200cpx;\'+(\'width:\'+cpx+\'cpx\')),{\'rem\':true,\'scale\':0.5,\'remOptions\':{\'rootValue\':75,\'minPixelValue\':1.01},\'autoprefixOptions\':{\'browsers\':[\'> 0.1%\',\'ios >= 8\',\'not ie < 12\']}})" class=" cml-base cml-button"></cml-buildin-button><thirdComp1 v-bind:style="_cmlStyleProxy(((\'width:\'+cpx+\'cpx;\'+\'height:\'+cpx2+\'cpx;background-color:red\')),{\'rem\':true,\'scale\':0.5,\'remOptions\':{\'rootValue\':75,\'minPixelValue\':1.01},\'autoprefixOptions\':{\'browsers\':[\'> 0.1%\',\'ios >= 8\',\'not ie < 12\']}})" class=" cml-base cml-thirdComp1"></thirdComp1></div>`);
    });
    it('parse-style-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:style="_cmlStyleProxy((\'width:\'+(cpx)+\'cpx;height:100cpx;border-width:200cpx;\'+(\'width:\'+cpx+\'cpx\')))" class=" cml-base cml-button"></cml-buildin-button><thirdComp1 v-bind:style="_cmlStyleProxy(((\'width:\'+cpx+\'cpx;\'+\'height:\'+cpx2+\'cpx;background-color:red\')))" class=" cml-base cml-thirdComp1"></thirdComp1></div>`);
    });
    // wx baidu alipay
    it('parse-style-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button style="width:{{cpx}}rpx;height:100rpx;border-width:200rpx;{{\'width:\' + cpx + \'rpx\'}}" class=" cml-base cml-button"></cml-buildin-button><thirdComp1 style="{{\'width:\' + cpx + \'rpx;\' + \'height:\' + cpx2 + \'rpx;background-color:red\'}}" class=" cml-view cml-thirdComp1"></thirdComp1></view>`);
    });
  });
  // ref  动态
  describe('parse-ref-transform-dynamic', function() {
    let source = `<view ref='{{ refVlaue }}'></view>`;
    it('test-ref-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div v-bind:ref="( refVlaue )" class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div v-bind:ref="( refVlaue )" class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view  _cml_ref_lmc_" id="{{ refVlaue }}"></view>`);
    });
    it('test-ref-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view  _cml_ref_lmc_" id="{{ refVlaue }}"></view>`);
    });
    it('test-ref-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a  _cml_ref_lmc_" id="{{ refVlaue }}"></view>`);
    });
  });
  // ref  静态
  describe('parse-ref-transform-static', function() {
    let source = `<view ref=' refVlaue '></view>`;
    it('test-ref-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div ref=" refVlaue " class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div ref=" refVlaue " class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view  _cml_ref_lmc_" id=" refVlaue "></view>`);
    });
    it('test-ref-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view  _cml_ref_lmc_" id=" refVlaue "></view>`);
    });
    it('test-ref-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a  _cml_ref_lmc_" id=" refVlaue "></view>`);
    });
  });
  // component is
  describe('parse-component-is-transform', function() {
    let source = `<component is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" c-bind:click="handleClick"></component>`;
    it('test-component-is-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<component v-bind:is="(currentComp)" shrinkcomponents="comp1,comp2" v-bind:image-src="(chameleonSrc)" title="this is title" v-on:click="_cmlEventProxy($event,\'handleClick\',false)" class=" cml-base cml-component"></component>`);
    });
    it('test-component-is-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<component v-bind:is="(currentComp)" shrinkcomponents="comp1,comp2" v-bind:image-src="(chameleonSrc)" title="this is title" v-on:click="_cmlEventProxy($event,\'handleClick\',false)" class=" cml-base cml-component"></component>`);
    });
    it('test-component-is-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<comp2 wx:if="{{currentComp === \'comp2\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlEventProxy" data-eventtap="handleClick" class=" cml-base cml-component  cml-base cml-comp2"></comp2>;\n<comp1 wx:if="{{currentComp === \'comp1\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlEventProxy" data-eventtap="handleClick" class=" cml-base cml-component  cml-base cml-comp1"></comp1>`);
    });
    it('test-component-is-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<comp2 s-if="{{currentComp === \'comp2\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlEventProxy" data-eventtap="handleClick" class=" cml-base cml-component  cml-base cml-comp2"></comp2>;\n<comp1 s-if="{{currentComp === \'comp1\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlEventProxy" data-eventtap="handleClick" class=" cml-base cml-component  cml-base cml-comp1"></comp1>`);
    });
    it('test-component-is-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<comp2 a:if="{{currentComp === \'comp2\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" onTap="_cmlEventProxy" data-eventtap="handleClick" class=" cml-base cml-component cml-5766bf8a  cml-base cml-comp2 cml-5766bf8a"></comp2>;\n<comp1 a:if="{{currentComp === \'comp1\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" onTap="_cmlEventProxy" data-eventtap="handleClick" class=" cml-base cml-component cml-5766bf8a  cml-base cml-comp1 cml-5766bf8a"></comp1>`);
    });
  });

  // animation
  describe('parse-c-animation-transform', function() {
    let source = `<view c-animation='{{ animationData }}'></view>`;
    it('test-c-animation-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div v-animation=" animationData " class=" cml-base cml-view"></div>`);
    });
    it('test-c-animation-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div v-animation=" animationData " class=" cml-base cml-view"></div>`);
    });
    it('test-c-animation-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view animation="{{ animationData }}" bindtransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="animationData" data-args="\'animationData\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-view"></view>`);
    });
    it('test-c-animation-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view animation="{{ animationData }}" bindtransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="animationData" data-args="\'animationData\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-view"></view>`);
    });
    it('test-c-animation-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view animation="{{( animationData ).actions}}" onTransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="animationData" data-args="\'animationData\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-view cml-5766bf8a"></view>`);
    });
  });
  // attribute
  describe('parse-attribute-transform', function() {
    let source = `<view prop1="static" prop2="{{dynamic}}"></view>`;
    it('test-attribute-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div prop1="static" v-bind:prop2="(dynamic)" class=" cml-base cml-view"></div>`);
    });
    it('test-attribute-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div prop1="static" v-bind:prop2="(dynamic)" class=" cml-base cml-view"></div>`);
    });
    it('test-attribute-transform-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view prop1="static" prop2="{{dynamic}}" class=" cml-base cml-view"></view>`);
    });
  })
  // 各种 <  > 的转化
  describe('parse-gtlt-transform', function() {
    let source = `<view><view prop="{{dynamic}}" id="{{5 < 6 ? '5':'6'}}">{{ 5 > 6 ? 'this is 5':'this is 6'}}</view><view name="{{5 < 6?'7':'8'}}"></view></view>`;
    it('test-gtlt-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><div v-bind:prop="(dynamic)" v-bind:id="(5 < 6 ? \'5\':\'6\')" class=" cml-base cml-view">{{5 > 6 ? \'this is 5\' : \'this is 6\'}}</div><div v-bind:name="(5 < 6?\'7\':\'8\')" class=" cml-base cml-view"></div></div>`);
    });
    it('test-gtlt-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><div v-bind:prop="(dynamic)" v-bind:id="(5 < 6 ? \'5\':\'6\')" class=" cml-base cml-view">{{5 > 6 ? \'this is 5\' : \'this is 6\'}}</div><div v-bind:name="(5 < 6?\'7\':\'8\')" class=" cml-base cml-view"></div></div>`);
    });
    it('test-gtlt-transform-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><view prop="{{dynamic}}" id="{{5 < 6 ? \'5\':\'6\'}}" class=" cml-base cml-view">{{5 > 6 ? \'this is 5\' : \'this is 6\'}}</view><view name="{{5 < 6?\'7\':\'8\'}}" class=" cml-base cml-view"></view></view>`);
    });
  })

})
