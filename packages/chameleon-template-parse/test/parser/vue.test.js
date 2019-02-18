// cml 或者vue语法整体单元测试
const compileTemplate = require('../../src/index.js');
const expect = require('chai').expect;
let options = {lang: 'vue',
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
describe('parse-template-vue-all', function() {
  // parseTag
  describe('parse-tag-transform', function() {
    let source = `<view><button></button><thirdComp1></thirdComp1><thirdComp2></thirdComp2></view>`;
    it('test-tag-transform', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button"></cml-buildin-button><thirdComp1 class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class=" cml-base cml-button"></cml-buildin-button><thirdComp1 class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 class=" cml-base cml-thirdComp2"></thirdComp2></view>`)
    });
  });
  // directive
  describe('parse-directive-transform', function() {
    let source = `<view><button v-model=" value1"></button>
    <thirdComp1 v-show="vlaue2"></thirdComp1>
    <thirdComp2 v-text=" value3 "></thirdComp2>
    <thirdComp2 v-animation=" value3 "></thirdComp2>
    <thirdComp2 v-for=" (item,index) in value4 "></thirdComp2>
    <thirdComp2 v-if=" value5 "></thirdComp2>
    <thirdComp2 v-else-if=" value5 "></thirdComp2>
    <thirdComp2 v-else></thirdComp2>
    <view v-text="value6"></view>
    </view>`;
    it('test-directive-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-on:input="_cmlModelEventProxy($event,\'value1\')" v-bind:value="value1" class=" cml-base cml-button"></cml-buildin-button>\n    <thirdComp1 class=" cml-base cml-thirdComp1" v-show="vlaue2"></thirdComp1>\n    <thirdComp2 class=" cml-base cml-thirdComp2">{{value3}}</thirdComp2>\n    <thirdComp2 v-animation=" value3 " v-on:transitionend="_cmlInlineStatementEventProxy(\'_animationCb\',\'value3\',$event)" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 v-for=" (item,index) in value4 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 v-if=" value5 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 v-else-if=" value5 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 v-else class=" cml-base cml-thirdComp2"></thirdComp2>\n    <div class=" cml-base cml-view">{{value6}}</div>\n    </div>`);
    });
    it('test-directive-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-on:input="_cmlModelEventProxy($event,\'value1\')" v-bind:value="value1" class=" cml-base cml-button"></cml-buildin-button>\n    <thirdComp1 class=" cml-base cml-thirdComp1" v-bind:style="_cmlStyleProxy(\'display:\'+(vlaue2?\'\':\'none\')+\';\'+(vlaue2?\'\':\'height:0px;width:0px;overflow:hidden\'))"></thirdComp1>\n    <thirdComp2 class=" cml-base cml-thirdComp2">{{value3}}</thirdComp2>\n    <thirdComp2 v-animation=" value3 " v-on:transitionend="_cmlInlineStatementEventProxy(\'_animationCb\',\'value3\',$event)" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 v-for=" (item,index) in value4 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 v-if=" value5 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 v-else-if=" value5 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 v-else class=" cml-base cml-thirdComp2"></thirdComp2>\n    <div class=" cml-base cml-view">{{value6}}</div>\n    </div>`)
    });
    it('test-directive-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button data-modelkey="value1" bindinput="_cmlModelEventProxy" value="{{ value1}}" class=" cml-base cml-button"></cml-buildin-button>\n    <thirdComp1 class=" cml-base cml-thirdComp1" style="display:{{vlaue2?\'\':\'none\'}};{{vlaue2?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></thirdComp1>\n    <thirdComp2 class=" cml-base cml-thirdComp2">{{value3}}</thirdComp2>\n    <thirdComp2 v-animation=" value3 " bindtransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="value3" data-args="\'value3\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 wx:for-item="item" wx:for-index="index" wx:for="{{value4 }}" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 wx:if="{{ value5 }}" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 wx:elif="{{ value5 }}" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 wx:else class=" cml-base cml-thirdComp2"></thirdComp2>\n    <view class=" cml-base cml-view">{{value6}}</view>\n    </view>`)
    });
    it('test-directive-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button data-modelkey="value1" bindInput="_cmlModelEventProxy" value="{{ value1}}" class=" cml-base cml-button"></cml-buildin-button>\n    <thirdComp1 class=" cml-base cml-thirdComp1" style="display:{{vlaue2?\'\':\'none\'}};{{vlaue2?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></thirdComp1>\n    <thirdComp2 class=" cml-base cml-thirdComp2">{{value3}}</thirdComp2>\n    <thirdComp2 v-animation=" value3 " onTransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="value3" data-args="\'value3\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 a:for-item="item" a:for-index="index" a:for="{{value4 }}" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 a:if="{{ value5 }}" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 a:elif="{{ value5 }}" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 a:else class=" cml-base cml-thirdComp2"></thirdComp2>\n    <view class=" cml-base cml-view">{{value6}}</view>\n    </view>`)
    });
    it('test-directive-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button data-modelkey="value1" bindinput="_cmlModelEventProxy" value="{{ value1}}" class=" cml-base cml-button"></cml-buildin-button>\n    <thirdComp1 class=" cml-base cml-thirdComp1" style="display:{{vlaue2?\'\':\'none\'}};{{vlaue2?\'\':\'height:0px;width:0px;overflow:hidden\'}}"></thirdComp1>\n    <thirdComp2 class=" cml-base cml-thirdComp2">{{value3}}</thirdComp2>\n    <thirdComp2 v-animation=" value3 " bindtransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="value3" data-args="\'value3\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 s-for-item="item" s-for-index="index" s-for="value4 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 s-if=" value5 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 s-elif=" value5 " class=" cml-base cml-thirdComp2"></thirdComp2>\n    <thirdComp2 s-else class=" cml-base cml-thirdComp2"></thirdComp2>\n    <view class=" cml-base cml-view">{{value6}}</view>\n    </view>`)
    });
  });
  // parseEvent
  describe('parse-event-transform', function() {
    let source = `<view><origin-tag v-on:tap="handleClick"></origin-tag><thirdComp1 @tap="handleClick(1,item,'str')"></thirdComp1><thirdComp2 v-on:tap="handleClick(1,item,'str')"></thirdComp2></view>`;
    it('test-event-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click="_cmlInlineStatementEventProxy(\'handleClick\',1,item,\'str\')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
    it('test-event-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><tag v-on:click="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 v-on:click="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 v-on:click="_cmlInlineStatementEventProxy(\'handleClick\',1,item,\'str\')" class=" cml-base cml-thirdComp2"></thirdComp2></div>`);
    });
    it('test-event-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><tag bindtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 bindtap="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 bindtap="_cmlInlineStatementEventProxy" data-arg2="str" data-arg1="{{item}}" data-arg0="{{1}}" data-args="1,item,\'str\'" data-eventtap="handleClick" class=" cml-base cml-thirdComp2"></thirdComp2></view>`);
    });
    it('test-event-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view class=" cml-base cml-view"><tag onTap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 onTap="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 onTap="_cmlInlineStatementEventProxy" data-arg2="str" data-arg1="{{item}}" data-arg0="{{1}}" data-args="1,item,\'str\'" data-eventtap="handleClick" class=" cml-base cml-thirdComp2"></thirdComp2></view>`);
    });
    it('test-event-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view class=" cml-base cml-view"><tag bindtap="handleClick" class=" cml-base cml-origin-tag"></tag><thirdComp1 bindtap="handleClick(1,item,\'str\')" class=" cml-base cml-thirdComp1"></thirdComp1><thirdComp2 bindtap="_cmlInlineStatementEventProxy" data-arg2="str" data-arg1="{{item}}" data-arg0="{{1}}" data-args="1,item,\'str\'" data-eventtap="handleClick" class=" cml-base cml-thirdComp2"></thirdComp2></view>`);
    });
  });
  // class
  describe('parse-class-transform', function() {
    let source = `<view><button :class="true ? 'cls2':'cls3'" class="cls1"></button><thirdComp1 class="cls4"></thirdComp1></view>`;
    it('parse-class-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:class="true ? \'cls2\':\'cls3\'" class="cls1   cml-base cml-button"></cml-buildin-button><thirdComp1 class="cls4   cml-base cml-thirdComp1"></thirdComp1></div>`);
    });
    it('parse-class-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div class=" cml-base cml-view"><cml-buildin-button v-bind:class="_weexClassProxy((true ? \'cls2\':\'cls3\'))" class="cls1   cml-base cml-button"></cml-buildin-button><thirdComp1 class="cls4   cml-base cml-thirdComp1"></thirdComp1></div>`);
    });
    // wx baidu alipay
    it('parse-class-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view"><cml-buildin-button class="{{true ? \'cls2\':\'cls3\'}} cls1  cml-base cml-button"></cml-buildin-button><thirdComp1 class="cls4  cml-base cml-thirdComp1"></thirdComp1></view>`);
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
  // ref
  describe('parse-ref-transform', function() {
    let source = `<view ref='{{ refVlaue }}'></view>`;
    it('test-ref-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div v-bind:ref="( refVlaue )" class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div v-bind:ref="( refVlaue )" class=" cml-base cml-view"></div>`);
    });
    it('test-ref-transform-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view class=" cml-base cml-view  _cml_ref_lmc_" id="{{ refVlaue }}"></view>`);
    });
  });
  // // component is
  describe('parse-component-is-transform', function() {
    let source = `<component :is="currentComp" shrinkComponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title"></component>`;
    it('test-component-is-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<component v-bind:is="currentComp" shrinkComponents="comp1,comp2" v-bind:image-src="(chameleonSrc)" title="this is title" class=" cml-base cml-component"></component>`);
    });
    it('test-component-is-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<component v-bind:is="currentComp" shrinkComponents="comp1,comp2" v-bind:image-src="(chameleonSrc)" title="this is title" class=" cml-base cml-component"></component>`);
    });
    it('test-component-is-transform-miniapp', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<comp2 wx:if="{{currentComp === \'comp2\'}}" v-bind:is="currentComp" shrinkComponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" class=" cml-base cml-component  cml-base cml-comp1  cml-base cml-comp2"></comp2>;\n<comp1 wx:if="{{currentComp === \'comp1\'}}" v-bind:is="currentComp" shrinkComponents="comp1,comp2" image-src="{{chameleonSrc}}" title="this is title" class=" cml-base cml-component  cml-base cml-comp1  cml-base cml-comp2"></comp1>`);
    });
  });

  // // animation
  describe('parse-v-animation-transform', function() {
    let source = `<view v-animation=' animationData '></view>`;
    it('test-c-animation-transform-web', function() {
      expect(compileTemplate(source, 'web', options).source).to.equal(`<div v-animation=" animationData " v-on:transitionend="_cmlInlineStatementEventProxy(\'_animationCb\',\'animationData\',$event)" class=" cml-base cml-view"></div>`);
    });
    it('test-c-animation-transform-weex', function() {
      expect(compileTemplate(source, 'weex', options).source).to.equal(`<div v-animation=" animationData " v-on:transitionend="_cmlInlineStatementEventProxy(\'_animationCb\',\'animationData\',$event)" class=" cml-base cml-view"></div>`);
    });
    it('test-c-animation-transform-wx', function() {
      expect(compileTemplate(source, 'wx', options).source).to.equal(`<view v-animation=" animationData " bindtransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="animationData" data-args="\'animationData\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-view"></view>`);
    });
    it('test-c-animation-transform-baidu', function() {
      expect(compileTemplate(source, 'baidu', options).source).to.equal(`<view v-animation=" animationData " bindtransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="animationData" data-args="\'animationData\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-view"></view>`);
    });
    it('test-c-animation-transform-alipay', function() {
      expect(compileTemplate(source, 'alipay', options).source).to.equal(`<view v-animation=" animationData " onTransitionend="_cmlInlineStatementEventProxy" data-arg1="$event" data-arg0="animationData" data-args="\'animationData\',$event" data-eventtransitionend="_animationCb" class=" cml-base cml-view"></view>`);
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
  })

})
