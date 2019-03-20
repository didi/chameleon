const processTemplate = require('../../src/common/process-template');
const expect = require('chai').expect;
let options = {lang: 'cml',
  buildInComponents: {button: "cml-buildin-button", 'c-tab-item': 'cml-buildin-tab'},
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
describe('process-template', function() {
  describe('preParseAliComponent', function() {
    // 组件需要进行一层包裹， 有些特定的组件不要被包裹 c-tab-item
    it('test alipay component wraped', function() {
      let source = `<view><c-tab-item></c-tab-item><thirdComp2></thirdComp2><button></button><text></text></view>`
      expect(processTemplate.preParseAliComponent(source, 'alipay', options)).to.equal(`<view  ><c-tab-item  ></c-tab-item><view  ><thirdComp2  ></thirdComp2></view><view  ><button  ></button></view><text  ></text></view>`)
    })
    // 组件上的 c-if c-else v-if   class style需要外移到包裹层
    it('test alipay component wraped', function() {
      let source = `<view><c-tab-item></c-tab-item><thirdComp2 v-if="true"></thirdComp2><button class="cls1" :class="cls2" style="width:100cpx"></button><text></text></view>`
      expect(processTemplate.preParseAliComponent(source, 'alipay', options)).to.equal(`<view  ><c-tab-item  ></c-tab-item><view  v-if="true" ><thirdComp2  ></thirdComp2></view><view  class="cls1" :class="cls2" style="width:100cpx" ><button  class="cls1" :class="cls2" style="width:100cpx" ></button></view><text  ></text></view>`)
    });
    // 一元标签的处理,组件一元标签也是需要被包裹，非组件一元标签则不会,组件在options中有声明
    it('test alipay component wraped', function() {
      let source = `<view><input class="cls1" style="width:100cpx" /><button class='btn' />你好</view>`
      expect(processTemplate.preParseAliComponent(source, 'alipay', options)).to.equal(`<view  ><input  class="cls1" style="width:100cpx" /><view  class=\'btn\' ><button  class=\'btn\' /></view>你好</view>`)
    })
  });
  describe('preParseBindAttr', function() {
    it('support :sth="name"', function() {
      expect(processTemplate.preParseBindAttr(`<view :name="sth" v-on:click="handleClick"></view>`)).to.equal(`<view v-bind:name="sth" v-on:click="handleClick"></view>`)
    })
  });
  describe('preParseVueEvent', function() {
    it('support @ v-on', function() {
      expect(processTemplate.preParseVueEvent(`<view v-on:touch="handle1" @click="handle2"></view>`)).to.equal(`<view c-bind:touch="handle1" c-bind:tap="handle2"></view>`)
    })
  });
  describe('preParseGtLt', function() {
    it('transform < > in {{}} to _cml_lt_lmc_  _cml_gt_lmc_', function() {
      expect(processTemplate.preParseGtLt(`{{< >}}`)).to.equal(`{{_cml_lt_lmc_ _cml_gt_lmc_}}`)
    })
  });
  describe('preParseMustache', function() {
    it('transform <view>{{}}</view> to <view>_cml{}lmc_</view>', function() {
      expect(processTemplate.preParseMustache(`<view>{{}}</view>`)).to.equal(`<view>_cml{}lmc_</view>`)
    })
  });
  describe('preDisappearAnnotation', function() {
    it(`disappear annotation like <!--something--> become ''`, function() {
      expect(processTemplate.preDisappearAnnotation(`<!--something-->`)).to.equal('')
    })
  });
  // preParseAnimation 只处理wx  alipay  baidu
  describe('preParseAnimation', function() {
    it(`preParse Animation add c-bind:transitionend="_animationCb(...)"`, function() {
      expect(processTemplate.preParseAnimation(`<view><text c-animation="{{ sss }}">click</text></view>`, 'wx')).to.equal(`<view><text c-animation="{{ sss }}" c-bind:transitionend="_animationCb('sss',$event)">click</text></view>;`);
    })
  });
  describe('preParseEventSyntax', function() {
    it('support @ v-on', function() {
      expect(processTemplate.preParseEventSyntax(`<view v-on:touch="handle1" @click="handle2"></view>`)).to.equal(`<view v-on:touch="handle1" v-on:tap="handle2"></view>`)
    })
  });
  describe('preCheckTemplateSyntax', function() {
    it('preCheckTemplateSyntax for cml', function() {
      let checkOptions = {lang: 'cml', filePath: '/users/components/button.cml'}
      expect(processTemplate.preCheckTemplateSyntax(`<view @click="handleClick " v-if="true" :id="value"></view>`, 'web', checkOptions)).to.equal(`with cml syntax you can not use @ or v-on  to get event binded , please use  \'c-bind\';v-if can\'t be used with cml syntax ;<div v-bind:id="value"></div> 或者 <div :id="value"></div> can not be used with cml syntax,please use  <div id={{value}}></div> `)
    })
  });
  describe('preCheckTemplateSyntax', function() {
    it('preCheckTemplateSyntax for vue', function() {
      let checkOptions = {lang: 'vue', filePath: '/users/components/button.cml'}
      expect(processTemplate.preCheckTemplateSyntax(`<view c-bind:click="handleClick " c-if="true" id="{{value}}"></view>`, 'web', checkOptions)).to.equal(`with vue syntax you can not use \'c-bind\' to get event binded , please use  @ or v-on;c-if can\'t be used with vue syntax ;<div id={{value}}></div> can not be used with vue syntax,please use <div v-bind:id="value"></div> 或者 <div :id="value"></div> `)
    })
  });
  describe('postParseMustache', function() {
    it('transform <view>_cml{}lmc_</view> to <view>{{}}</view> ', function() {
      expect(processTemplate.postParseMustache(`<view>_cml{}lmc_</view>`)).to.equal(`<view>{{}}</view>`)
    })
  });
  describe('postParseLtGt', function() {
    it('transform _cml_lt_lmc_  _cml_gt_lmc_ to < > in {{}} ', function() {
      expect(processTemplate.postParseLtGt(`{{_cml_lt_lmc_ _cml_gt_lmc_}}`)).to.equal(`{{< >}}`)
    })
  });
  describe('postParseUnicode', function() {
    it('transform \\u to %u', function() {
      expect(processTemplate.postParseUnicode(`\\u`)).to.equal(`%u`)
    })
  });
  describe('postParseOriginTag', function() {
    it('transform <origin-tag></origin-tag> to <tag></tag>', function() {
      expect(processTemplate.postParseOriginTag(`<view><origin-input></origin-input></view>`)).to.equal(`<view><input></input></view>;`)
    })
  });
  describe('analyzeTemplate', function() {
    it('collect which build-in-tag is used in template', function() {
      let options = {buildInComponents: {button: "cml-buildin-button"}};
      expect(processTemplate.analyzeTemplate(`<view><button></button></view>`, options)).to.include.keys('usedBuildInTagMap')
    })
  });
})
