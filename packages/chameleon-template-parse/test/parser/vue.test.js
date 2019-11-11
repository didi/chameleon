// cml 或者vue语法整体单元测试
const compileTemplate = require('../../src/index.js');
const expect = require('chai').expect;
let options = {lang: 'vue',
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
describe('parse-template-vue-all', function() {
  // parseTag
  describe('parse-tag-transform', function() {
    let source = `<view><button></button><thirdComp1></thirdComp1><thirdComp2></thirdComp2></view>`;
    it('test-tag-transform', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button"></cml-buildin-button><thirdComp1 class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button"></cml-buildin-button><thirdComp1 class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 class=" cml-view cml-thirdComp2"></thirdComp2></view>`)
    });
  });
  // directive v-model
  describe('parse-directive-transform', function() {
    let source = `<view><button v-model=" value1"></button></view>`;
    it('test-directive-v-model-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-on:input="_cmlModelEventProxy($event,\'value1\')" v-bind:value="value1" class=" cml-base cml-button"></cml-buildin-button></div>`);
    });
    it('test-directive-v-model-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-on:input="_cmlModelEventProxy($event,\'value1\')" v-bind:value="value1" class=" cml-base cml-button"></cml-buildin-button></div>`)
    });
    it('test-directive-v-model-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button data-modelkey="value1" bindinput="_cmlModelEventProxy" value="{{ value1}}" class=" cml-base cml-button"></cml-buildin-button></view>`)
    });
    it('test-directive-v-model-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button data-modelkey="value1" bindinput="_cmlModelEventProxy" value="{{ value1}}" class=" cml-base cml-button"></cml-buildin-button></view>`)
    });
    it('test-directive-v-model-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view class=" cml-base cml-view cml-5766bf8a"><cml-buildin-button data-modelkey="value1" data-eventinput="_cmlModelEventProxy" onInput="_cmlModelEventProxy" value="{{ value1}}" class=" cml-base cml-button cml-5766bf8a"></cml-buildin-button></view></view>`)
    });
    it('test-directive-v-model-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button data-modelkey="value1" bindinput="_cmlModelEventProxy" value="{{ value1}}" class=" cml-base cml-button"></cml-buildin-button></view>`)
    });
  });
  // directive v-show
  describe('parse-directive-transform', function() {
    let source = `<view><button v-show="  value1"></button></view>`;
    it('test-directive-v-show-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" v-show="  value1"></cml-buildin-button></div>`);
    });
    it('test-directive-v-show-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" v-bind:style="_cmlStyleProxy(\'display:\'+(  value1?\'\':\'none\')+\';\'+(  value1?\'\':\'height:0px;width:0px;overflow:hidden\'))"></cml-buildin-button></div>`)
    });
    it('test-directive-v-show-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" style="display:{{  value1?\'\':\'none\'}};{{  value1?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></cml-buildin-button></view>`)
    });
    it('test-directive-v-show-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" style="display:{{  value1?\'\':\'none\'}};{{  value1?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></cml-buildin-button></view>`)
    });
    it('test-directive-v-show-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view class=" cml-base cml-view cml-5766bf8a" style="display:{{  value1?\'\':\'none\'}};{{  value1?\'\':\'height:0px;width:0px;overflow:hidden\'}}"><cml-buildin-button class=" cml-base cml-button cml-5766bf8a" style="display:{{  value1?\'\':\'none\'}};{{  value1?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></cml-buildin-button></view></view>`)
    });
    it('test-directive-v-show-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button" style="display:{{  value1?\'\':\'none\'}};{{  value1?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></cml-buildin-button></view>`)
    });
  });
  // directive v-text
  describe('parse-directive-transform', function() {
    let source = `<view><button v-text="  value1"></button></view>`;
    it('test-directive-v-text-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></div>`);
    });
    it('test-directive-v-text-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></div>`)
    });
    it('test-directive-v-text-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></view>`)
    });
    it('test-directive-v-text-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></view>`)
    });
    it('test-directive-v-text-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view class=" cml-base cml-view cml-5766bf8a"><cml-buildin-button class=" cml-base cml-button cml-5766bf8a">{{value1}}</cml-buildin-button></view></view>`)
    });
    it('test-directive-v-text-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button">{{value1}}</cml-buildin-button></view>`)
    });
  });
  // directive v-if  v-else-if  v-else
  describe('parse-directive-transform', function() {
    let source = `<view><button v-if="value1"></button>
    <view v-else-if="value1"></view>
    <view v-else="value1"></view></view>`;
    it('test-directive-v-condition-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-if="value1" class=" cml-base cml-button"></cml-buildin-button>\n    <div v-else-if="value1" class=" cml-base cml-view"></div>\n    <div v-else="value1" class=" cml-base cml-view"></div></div>`);
    });
    it('test-directive-v-condition-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-if="value1" class=" cml-base cml-button"></cml-buildin-button>\n    <div v-else-if="value1" class=" cml-base cml-view"></div>\n    <div v-else="value1" class=" cml-base cml-view"></div></div>`)
    });
    it('test-directive-v-condition-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button wx:if="{{value1}}" class=" cml-base cml-button"></cml-buildin-button>\n    <view wx:elif="{{value1}}" class=" cml-base cml-view"></view>\n    <view wx:else="{{value1}}" class=" cml-base cml-view"></view></view>`)
    });
    it('test-directive-v-condition-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button qq:if="{{value1}}" class=" cml-base cml-button"></cml-buildin-button>\n    <view qq:elif="{{value1}}" class=" cml-base cml-view"></view>\n    <view qq:else="{{value1}}" class=" cml-base cml-view"></view></view>`)
    });
    it('test-directive-v-condition-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view a:if="{{value1}}" class=" cml-base cml-view cml-5766bf8a"><cml-buildin-button class=" cml-base cml-button cml-5766bf8a"></cml-buildin-button></view>\n    <view a:elif="{{value1}}" class=" cml-base cml-view cml-5766bf8a"></view>\n    <view a:else="{{value1}}" class=" cml-base cml-view cml-5766bf8a"></view></view>`)
    });
    it('test-directive-v-condition-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button s-if="value1" class=" cml-base cml-button"></cml-buildin-button>\n    <view s-elif="value1" class=" cml-base cml-view"></view>\n    <view s-else="value1" class=" cml-base cml-view"></view></view>`)
    });
  });
  // directive v-for
  describe('parse-directive-transform', function() {
    let source = `<view><view v-for="(item ,index) in array">{{item.id}}  </view></view>`;
    it('test-directive-v-interator-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item ,index) in array" class=" cml-base cml-view">{{item.id}}  </div></div>`);
    });
    it('test-directive-v-interator-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item ,index) in array" class=" cml-base cml-view">{{item.id}}  </div></div>`)
    });
    it('test-directive-v-interator-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><view wx:for-item="item" wx:for-index="index" wx:for="{{array}}" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><view qq:for-item="item" qq:for-index="index" qq:for="{{array}}" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view a:for-item="item" a:for-index="index" a:for="{{array}}" class=" cml-base cml-view cml-5766bf8a">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><view s-for-item="item" s-for-index="index" s-for="array" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
  });
  // directive c-for  c-for-index  c-for-item c-key
  describe('parse-directive-transform', function() {
    let source = `<view><view v-for="(item,index) in array" :key="item.id">{{item.id}}  </view></view>`;
    it('test-directive-v-interator-key-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item,index) in array" v-bind:key="item.id" class=" cml-base cml-view">{{item.id}}  </div></div>`);
    });
    it('test-directive-v-interator-key-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item,index) in array" v-bind:key="item.id" class=" cml-base cml-view">{{item.id}}  </div></div>`)
    });
    it('test-directive-v-interator-key-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><view wx:for-item="item" wx:for-index="index" wx:for="{{array}}" wx:key="id" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-key-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><view qq:for-item="item" qq:for-index="index" qq:for="{{array}}" qq:key="id" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-key-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view a:for-item="item" a:for-index="index" a:for="{{array}}" a:key="id" class=" cml-base cml-view cml-5766bf8a">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-key-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><view s-for-item="item" s-for-index="index" s-for="array" s-key="id" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
  });
  // directive c-for  c-for-index  c-for-item c-key:*this
  describe('parse-directive-transform', function() {
    let source = `<view><view v-for="(item,index) in array" :key="item">{{item.id}}  </view></view>`;
    it('test-directive-v-interator-*this-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item,index) in array" v-bind:key="item" class=" cml-base cml-view">{{item.id}}  </div></div>`);
    });
    it('test-directive-v-interator-*this-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><div v-for="(item,index) in array" v-bind:key="item" class=" cml-base cml-view">{{item.id}}  </div></div>`)
    });
    it('test-directive-v-interator-*this-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><view wx:for-item="item" wx:for-index="index" wx:for="{{array}}" wx:key="*this" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-*this-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><view qq:for-item="item" qq:for-index="index" qq:for="{{array}}" qq:key="*this" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-*this-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view a:for-item="item" a:for-index="index" a:for="{{array}}" a:key="*this" class=" cml-base cml-view cml-5766bf8a">{{item.id}}  </view></view>`)
    });
    it('test-directive-v-interator-*this-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><view s-for-item="item" s-for-index="index" s-for="array" s-key="*this" class=" cml-base cml-view">{{item.id}}  </view></view>`)
    });
  });
  // parseEvent
  describe('parse-event-transform', function() {
    let source = `<view><origin-tag v-on:tap="handleClick"></origin-tag><thirdComp1 @tap="handleClick(1,item,'str')"></thirdComp1><thirdComp2 v-on:tap="handleClick(1,item,'str')"></thirdComp2><view v-on:touchend="handleClick()" v-on:touchmove="handleClick"></view></view>`;
    it('test-event-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:tap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:tap="handleClick(1,item,'str')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:tap.native="_cmlInline('handleClick',false,1,item,'str')" class=" cml-base cml-thirdComp2"></thirdComp2><div v-on:touchend="_cmlInline('handleClick',false)" v-on:touchmove="_cmlEventProxy($event,'handleClick',false)" class=" cml-base cml-view"></div></div>`);
    });
    it('test-event-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,'str')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click.native="_cmlInline('handleClick',false,1,item,'str')" class=" cml-base cml-thirdComp2"></thirdComp2><div v-on:touchend="_cmlInline('handleClick',false)" v-on:touchmove="_cmlEventProxy($event,'handleClick',false)" class=" cml-base cml-view"></div></div>`);
    });
    it('test-event-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><tag bindtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 bindtap="handleClick(1,item,'str')" class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 bindtap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-view cml-thirdComp2"></thirdComp2><view bindtouchend="_cmlInline" data-eventtouchend="{{['handleClick']}}" bindtouchmove="_cmlEventProxy" data-eventtouchmove="{{['handleClick']}}" class=" cml-base cml-view"></view></view>`);
    });
    it('test-event-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><tag bindtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 bindtap="handleClick(1,item,'str')" class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 bindtap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-view cml-thirdComp2"></thirdComp2><view bindtouchend="_cmlInline" data-eventtouchend="{{['handleClick']}}" bindtouchmove="_cmlEventProxy" data-eventtouchmove="{{['handleClick']}}" class=" cml-base cml-view"></view></view>`);
    });
    it('test-event-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><tag onTap="handleClick" class=" cml-base cml-origin-tag cml-5766bf8a"></tag><view onTap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-base cml-view cml-5766bf8a"><thirdComp1 onTap="handleClick(1,item,'str')" class=" cml-base cml-thirdComp1 cml-5766bf8a"></thirdComp1></view><view onTap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-base cml-view cml-5766bf8a"><thirdComp2 onTap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-base cml-thirdComp2 cml-5766bf8a"></thirdComp2></view><view onTouchEnd="_cmlInline" data-eventtouchend="{{['handleClick']}}" onTouchMove="_cmlEventProxy" data-eventtouchmove="{{['handleClick']}}" class=" cml-base cml-view cml-5766bf8a"></view></view>`);
    });
    it('test-event-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><tag bindtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 bindtap="handleClick(1,item,'str')" class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 bindtap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-view cml-thirdComp2"></thirdComp2><view bindtouchend="_cmlInline" data-eventtouchend="{{['handleClick']}}" bindtouchmove="_cmlEventProxy" data-eventtouchmove="{{['handleClick']}}" class=" cml-base cml-view"></view></view>`);
    });
  });
  // parseEvent-.stop  web weex
  describe('parse-event-transform-stop', function() {
    let source = `<view><origin-tag v-on:tap.stop="handleClick"></origin-tag><thirdComp1 @tap.stop="handleClick(1,item,'str')"></thirdComp1><thirdComp2 v-on:tap.stop="handleClick(1,item,'str')"></thirdComp2></view>`;
    it('test-event-transform-web-stop', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:tap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:tap="handleClick(1,item,'str')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:tap.native="_cmlInline('handleClick',true,1,item,'str')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
    it('test-event-transform-weex-stop', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,'str')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click.native="_cmlInline('handleClick',true,1,item,'str')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
    it('test-event-transform-wx-stop', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><tag catchtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 catchtap="handleClick(1,item,'str')" class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 catchtap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-view cml-thirdComp2"></thirdComp2></view>`);
    });
    it('test-event-transform-qq-stop', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view class=" cml-base cml-view"><tag catchtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 catchtap="handleClick(1,item,'str')" class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 catchtap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-view cml-thirdComp2"></thirdComp2></view>`);
    });
    it('test-event-transform-baidu-stop', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><tag catchtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 catchtap="handleClick(1,item,'str')" class=" cml-view cml-thirdComp1"></thirdComp1><thirdComp2 catchtap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-view cml-thirdComp2"></thirdComp2></view>`);
    });
    it('test-event-transform-alipay-stop', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><tag catchTap="handleClick" class=" cml-base cml-origin-tag cml-5766bf8a"></tag><view catchTap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-base cml-view cml-5766bf8a"><thirdComp1 catchTap="handleClick(1,item,'str')" class=" cml-base cml-thirdComp1 cml-5766bf8a"></thirdComp1></view><view catchTap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-base cml-view cml-5766bf8a"><thirdComp2 catchTap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" class=" cml-base cml-thirdComp2 cml-5766bf8a"></thirdComp2></view></view>`);
    });
  });
  // parseEvent- origin-tag 的click不处理成tap
  describe('parse-event-transform-origin-tag', function() {
    let source = `<view><origin-tag v-on:tap.stop="handleClick" @click="handleClick"></origin-tag><thirdComp1 @tap.stop="handleClick(1,item,'str')" @click="handleClick"></thirdComp1><thirdComp2 v-on:tap.stop="handleClick(1,item,'str')"></thirdComp2></view>`;
    it('test-event-transform-web-origin-tag', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:tap="handleClick" v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:tap="handleClick(1,item,'str')" v-on:click="handleClick" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:tap.native="_cmlInline('handleClick',true,1,item,'str')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
    it('test-event-transform-weex-origin-tag', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,'str')" v-on:click="handleClick" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click.native="_cmlInline('handleClick',true,1,item,'str')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
  });
  // 非原生组件外面包的view要添加原生事件
  describe('parse-event-transform-alicomponent', function() {
    let source = `<view><thirdComp2 @tap.stop="handleClick(1,item,'str')" data-args="1" v-on:touchstart.stop="handleClick(1,item,'str')"></thirdComp2></view>`;
    it('test-event-transform-alipay-alicomponent', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view catchTap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" data-args="1" catchTouchStart="_cmlInline" data-eventtouchstart="{{['handleClick',1,item,'str']}}" class=" cml-base cml-view cml-5766bf8a"><thirdComp2 catchTap="_cmlInline" data-eventtap="{{['handleClick',1,item,'str']}}" data-args="1" catchTouchStart="_cmlInline" data-eventtouchstart="{{['handleClick',1,item,'str']}}" class=" cml-base cml-thirdComp2 cml-5766bf8a"></thirdComp2></view></view>`);
    });

  });
  // class
  describe('parse-class-transform', function() {
    let source = `<view><button :class="true ? 'cls2':'cls3'" class="cls1"></button><thirdComp1 class="cls4"></thirdComp1><view :class="computedCls"></view></view>`;
    it('parse-class-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:class="true ? \'cls2\':\'cls3\'" class="cls1   cml-base cml-button"></cml-buildin-button><thirdComp1 class="cls4   cml-base cml-thirdComp1"></thirdComp1><div v-bind:class="computedCls" class=" cml-base cml-view"></div></div>`);
    });
    it('parse-class-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:class="_weexClassProxy((true ? 'cls2':'cls3'))" class="  cml-base cml-button cls1"></cml-buildin-button><thirdComp1 class="  cml-base cml-thirdComp1 cls4"></thirdComp1><div v-bind:class="_weexClassProxy((computedCls))" class=" cml-base cml-view"></div></div>`);
    });
    // wx baidu alipay
    it('parse-class-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class="{{true ? 'cls2':'cls3'}} cls1  cml-base cml-button"></cml-buildin-button><thirdComp1 class="cls4  cml-view cml-thirdComp1"></thirdComp1><view class="{{computedCls}}  cml-base cml-view"></view></view>`);
    });
  });
  // style 以及 miniappp端cpx动态测试
  describe('parse-style-transform', function() {
    let source = `<view><button :style="'width:'+cpx+'cpx;'+'height:'+cpx2+'cpx;background-color:red'"></button></view>`;
    it('parse-style-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:style="_cmlStyleProxy((\'width:\'+cpx+\'cpx;\'+\'height:\'+cpx2+\'cpx;background-color:red\'),{\'rem\':true,\'scale\':0.5,\'remOptions\':{\'rootValue\':75,\'minPixelValue\':1.01},\'autoprefixOptions\':{\'browsers\':[\'> 0.1%\',\'ios >= 8\',\'not ie < 12\']}})" class=" cml-base cml-button"></cml-buildin-button></div>`);
    });
    it('parse-style-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:style="_cmlStyleProxy((\'width:\'+cpx+\'cpx;\'+\'height:\'+cpx2+\'cpx;background-color:red\'))" class=" cml-base cml-button"></cml-buildin-button></div>`);
    });
    // wx baidu alipay
    it('parse-style-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button style="{{\'width:\' + cpx + \'rpx;\' + \'height:\' + cpx2 + \'rpx;background-color:red\'}}" class=" cml-base cml-button"></cml-buildin-button></view>`);
    });
  });
  // ref  动态
  describe('parse-ref-transform', function() {
    let source = `<view id="value" :ref=' refVlaue '></view>`;
    it('test-ref-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div id="value" v-bind:ref=" refVlaue " class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div id="value" v-bind:ref=" refVlaue " class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view id="{{ refVlaue }}" class=" cml-base cml-view  _cml_ref_lmc_"></view>`);
    });
    it('test-ref-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view id="{{ refVlaue }}" class=" cml-base cml-view  _cml_ref_lmc_"></view>`);
    });
    it('test-ref-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view id="{{ refVlaue }}" class=" cml-base cml-view  _cml_ref_lmc_"></view>`);
    });
    it('test-ref-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view id="{{ refVlaue }}" class=" cml-base cml-view cml-5766bf8a  _cml_ref_lmc_"></view>`);
    });
  });
  // ref  静态
  describe('parse-ref-transform', function() {
    let source = `<view id='value' ref=' refVlaue '></view>`;
    it('test-ref-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div id="value" ref=" refVlaue " class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div id="value" ref=" refVlaue " class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view id=" refVlaue " class=" cml-base cml-view  _cml_ref_lmc_"></view>`);
    });
  });
  //  component is
  describe('parse-component-is-transform', function() {
    let source = `<component :is="currentComp" shrinkcomponents="comp1,comp2" :image-src="chameleonSrc" title="this is title" @click="handleClick()" @userEvent="handleUserEvent" @lowerevent="handleLowerEvent(1,$event)"></component>`;
    it('test-component-is-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<component v-bind:is="currentComp" shrinkcomponents="comp1,comp2" v-bind:image-src="chameleonSrc" title="this is title" v-on:click.native="_cmlInline('handleClick',false)" v-on:userEvent="_cmlEventProxy($event,'handleUserEvent',false)" v-on:lowerevent="_cmlInline('handleLowerEvent',false,1,$event)" class=" cml-base cml-component"></component>`);
    });
    it('test-component-is-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<component v-bind:is="currentComp" shrinkcomponents="comp1,comp2" v-bind:image-src="chameleonSrc" title="this is title" v-on:click.native="_cmlInline('handleClick',false)" v-on:userEvent="_cmlEventProxy($event,'handleUserEvent',false)" v-on:lowerevent="_cmlInline('handleLowerEvent',false,1,$event)" class=" cml-base cml-component"></component>`);
    });
    it('test-component-is-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<comp2 wx:if="{{currentComp === \'comp2\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlInline" data-eventtap="{{[\'handleClick\']}}" binduserEvent="_cmlEventProxy" data-eventuserevent="{{[\'handleUserEvent\']}}" bindlowerevent="_cmlInline" data-eventlowerevent="{{[\'handleLowerEvent\',1,\'$event\']}}" class=" cml-base cml-component  cml-base cml-comp2"></comp2>;\n<comp1 wx:if="{{currentComp === \'comp1\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlInline" data-eventtap="{{[\'handleClick\']}}" binduserEvent="_cmlEventProxy" data-eventuserevent="{{[\'handleUserEvent\']}}" bindlowerevent="_cmlInline" data-eventlowerevent="{{[\'handleLowerEvent\',1,\'$event\']}}" class=" cml-base cml-component  cml-base cml-comp1"></comp1>`);
    });
    it('test-component-is-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<comp2 qq:if="{{currentComp === \'comp2\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlInline" data-eventtap="{{[\'handleClick\']}}" binduserEvent="_cmlEventProxy" data-eventuserevent="{{[\'handleUserEvent\']}}" bindlowerevent="_cmlInline" data-eventlowerevent="{{[\'handleLowerEvent\',1,\'$event\']}}" class=" cml-base cml-component  cml-base cml-comp2"></comp2>;\n<comp1 qq:if="{{currentComp === \'comp1\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlInline" data-eventtap="{{[\'handleClick\']}}" binduserEvent="_cmlEventProxy" data-eventuserevent="{{[\'handleUserEvent\']}}" bindlowerevent="_cmlInline" data-eventlowerevent="{{[\'handleLowerEvent\',1,\'$event\']}}" class=" cml-base cml-component  cml-base cml-comp1"></comp1>`);
    });
    it('test-component-is-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<comp2 a:if="{{currentComp === \'comp2\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" onTap="_cmlInline" data-eventtap="{{[\'handleClick\']}}" onUserEvent="_cmlEventProxy" data-eventuserevent="{{[\'handleUserEvent\']}}" onLowerevent="_cmlInline" data-eventlowerevent="{{[\'handleLowerEvent\',1,\'$event\']}}" class=" cml-base cml-component cml-5766bf8a  cml-base cml-comp2 cml-5766bf8a"></comp2>;\n<comp1 a:if="{{currentComp === \'comp1\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" onTap="_cmlInline" data-eventtap="{{[\'handleClick\']}}" onUserEvent="_cmlEventProxy" data-eventuserevent="{{[\'handleUserEvent\']}}" onLowerevent="_cmlInline" data-eventlowerevent="{{[\'handleLowerEvent\',1,\'$event\']}}" class=" cml-base cml-component cml-5766bf8a  cml-base cml-comp1 cml-5766bf8a"></comp1>`);
    });
    it('test-component-is-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<comp2 s-if="{{currentComp === \'comp2\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlInline" data-eventtap="{{[\'handleClick\']}}" binduserEvent="_cmlEventProxy" data-eventuserevent="{{[\'handleUserEvent\']}}" bindlowerevent="_cmlInline" data-eventlowerevent="{{[\'handleLowerEvent\',1,\'$event\']}}" class=" cml-base cml-component  cml-base cml-comp2"></comp2>;\n<comp1 s-if="{{currentComp === \'comp1\'}}" is="{{currentComp}}" shrinkcomponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" bindtap="_cmlInline" data-eventtap="{{[\'handleClick\']}}" binduserEvent="_cmlEventProxy" data-eventuserevent="{{[\'handleUserEvent\']}}" bindlowerevent="_cmlInline" data-eventlowerevent="{{[\'handleLowerEvent\',1,\'$event\']}}" class=" cml-base cml-component  cml-base cml-comp1"></comp1>`);
    });
  });

  // // animation
  describe('parse-v-animation-transform', function() {
    let source = `<view v-animation=' animationData '></view>`;
    it('test-c-animation-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div v-animation=" animationData " class=" cml-base cml-view"></div>`);
    });
    it('test-c-animation-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div v-animation=" animationData " class=" cml-base cml-view"></div>`);
    });
    it('test-c-animation-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view v-animation=" animationData " bindtransitionend="_cmlInline" data-eventtransitionend="{{['_animationCb','animationData','$event']}}" class=" cml-base cml-view"></view>`);
    });
    it('test-c-animation-transform-qq', function() {
      expect(compileTemplate(source, 'qq', options).source).to.equal(`<view v-animation=" animationData " bindtransitionend="_cmlInline" data-eventtransitionend="{{['_animationCb','animationData','$event']}}" class=" cml-base cml-view"></view>`);
    });
    it('test-c-animation-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view v-animation=" animationData " bindtransitionend="_cmlInline" data-eventtransitionend="{{['_animationCb','animationData','$event']}}" class=" cml-base cml-view"></view>`);
    });
    it('test-c-animation-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view v-animation=" animationData " onTransitionend="_cmlInline" data-eventtransitionend="{{['_animationCb','animationData','$event']}}" class=" cml-base cml-view cml-5766bf8a"></view>`);
    });
  });
  // // attribute
  describe('parse-attribute-transform', function() {
    let source = `<view prop1="static" :prop2="dynamic"></view>`;
    it('test-attribute-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div prop1="static" v-bind:prop2="dynamic" class=" cml-base cml-view"></div>`);
    });
    it('test-attribute-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div prop1="static" v-bind:prop2="dynamic" class=" cml-base cml-view"></div>`);
    });
    it('test-attribute-transform-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view prop1="static" prop2="{{dynamic}}" class=" cml-base cml-view"></view>`);
    });
  })
  // //各种 <  > 的转化
  describe('parse-gtlt-transform', function() {
    let source = `<view><view :prop="dynamic" :id="5 < 6 ? '5':'6'">{{ 5 > 6 ? 'this is 5':'this is 6'}}</view><view :name="5 < 6?'7':'8'"></view></view>`;
    it('test-gtlt-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><div v-bind:prop="dynamic" v-bind:id="5 < 6 ? \'5\':\'6\'" class=" cml-base cml-view">{{5 > 6 ? \'this is 5\' : \'this is 6\'}}</div><div v-bind:name="5 < 6?\'7\':\'8\'" class=" cml-base cml-view"></div></div>`);
    });
    it('test-gtlt-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><div v-bind:prop="dynamic" v-bind:id="5 < 6 ? \'5\':\'6\'" class=" cml-base cml-view">{{5 > 6 ? \'this is 5\' : \'this is 6\'}}</div><div v-bind:name="5 < 6?\'7\':\'8\'" class=" cml-base cml-view"></div></div>`);
    });
    it('test-gtlt-transform-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><view prop="{{dynamic}}" id="{{5 < 6 ? \'5\':\'6\'}}" class=" cml-base cml-view">{{5 > 6 ? \'this is 5\' : \'this is 6\'}}</view><view name="{{5 < 6?\'7\':\'8\'}}" class=" cml-base cml-view"></view></view>`);
    });
  });
  describe('test-alipaycomponent-wraped-vue', function() {
    let source = `<view><thirdComp2 v-on:click="handleClick" data-a="a" @touchstart="handleStart" ></thirdComp2></view>`;
    it('test-alipaycomponent-wraped', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view cml-5766bf8a"><view onTap="_cmlEventProxy" data-eventtap="{{['handleClick']}}" data-a="a" onTouchStart="_cmlEventProxy" data-eventtouchstart="{{['handleStart']}}" class=" cml-base cml-view cml-5766bf8a"><thirdComp2 onTap="_cmlEventProxy" data-eventtap="{{['handleClick']}}" data-a="a" onTouchStart="_cmlEventProxy" data-eventtouchstart="{{['handleStart']}}" class=" cml-base cml-thirdComp2 cml-5766bf8a"></thirdComp2></view></view>`);
    });
  });
  describe('test-class-noinjected', function() {
    let source = `<view ><view class="cls1"><thirdComp2 class="cls2 cls3"></thirdComp2></view></view>`;
    let cpOptions = JSON.parse(JSON.stringify(options));
    cpOptions.isInjectBaseStyle = false;
    it('test-class-noinjected-web', function() {
      expect(compileTemplate(source, 'web', cpOptions).source).to.equal(`<div><div class="cls1  "><thirdComp2 class="cls2 cls3  "></thirdComp2></div></div>`);
    });
    it('test-class-noinjected-weex', function() {
      expect(compileTemplate(source, 'weex', cpOptions).source).to.equal(`<div><div class="  cls1"><thirdComp2 class="  cls2 cls3"></thirdComp2></div></div>`);
    });
    it('test-class-noinjected-alipay', function() {
      expect(compileTemplate(source, 'alipay', cpOptions).source).to.equal(`<view class=" cml-5766bf8a"><view class="cls1  cml-5766bf8a"><view class="cls2 cls3  cml-5766bf8a"><thirdComp2 class="cls2 cls3  cml-5766bf8a"></thirdComp2></view></view></view>`);
    });
    it('test-class-noinjected-baidu', function() {
      expect(compileTemplate(source, 'baidu', cpOptions).source).to.equal(`<view><view class="cls1 "><thirdComp2 class="cls2 cls3 "></thirdComp2></view></view>`);
    });
    it('test-class-noinjected-wx', function() {
      expect(compileTemplate(source, 'wx', cpOptions).source).to.equal(`<view><view class="cls1 "><thirdComp2 class="cls2 cls3 "></thirdComp2></view></view>`);
    });
  });
})
