const processTemplate = require('../../src/common/process-template');
const expect = require('chai').expect;
describe('process-template', function() {
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
  // preParseAnimation
  describe('preParseAnimation', function() {
    it(`preParse Animation add c-bind:transitionend="_animationCb(...)"`, function() {
      expect(processTemplate.preParseAnimation(`<view><text c-animation="{{sss}}" c-bind:transitionend="_animationCb('sss',$event)">click</text></view>;`))
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
})
