const expect = require('chai').expect;
const processTemplate = require('./lib/process-template.js');
let options = {
  lang: 'cml',
  buildInComponents: {button: "cml-buildin-button"},
  usingComponents: [{
    tagName: 'third-comp1',
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
  describe('trim', function() {
    it('test-trim', function() {
      expect(processTemplate.trim('   value   ')).to.equal('value');
    });
  });
  describe('vueToCml', function() {
    it('test-vueToCml-event', function() {
      let source = `<view><!-- 事件 --><view :id="value" name="nameStr" @click="handleClick"></view><view @click.stop="handleClick(1,2,item)"></view><view v-on:click.stop="handleClick(1,2,item)"></view></view>`
      expect(processTemplate.vueToCml(source).source).to.equal('<view><view id="{{value}}" name="nameStr" c-bind:tap="handleClick"></view><view c-catch:tap="handleClick(1,2,item)"></view><view c-catch:tap="handleClick(1,2,item)"></view></view>');
    });
  });
  describe('vueToCml', function() {
    it('test-vueToCml-directive', function() {
      let source = `<view><!-- 指令 v-if v-else-if v-else v-model v-show v-text--><view v-if="1 > 0.5">A</view><view v-else-if="show">B</view><view v-else>c</view><view v-show="!show"></view><view v-model="modelValue"></view><view v-text="text"></view></view>`
      expect(processTemplate.vueToCml(source).source).to.equal('<view><view c-if="{{1 > 0.5}}">A</view><view c-else-if="{{show}}">B</view><view c-else>c</view><view c-show="{{!show}}"></view><view c-model="{{modelValue}}"></view><view c-text="{{text}}"></view></view>');
    });
  });
  describe('vueToCml', function() {
    it('test-vueToCml-interation-haskey', function() {
      let source = `<view><!-- 循环 --><view v-for="item in array" :key="item.id"><view>{{item.id}}{{item[11]}}</view></view></view>`
      expect(processTemplate.vueToCml(source).source).to.equal('<view><view c-for="{{array}}" c-for-item="item" c-for-index="index" c-key="id"><view>{{item.id}}{{item[11]}}</view></view></view>');
    });
  });
  describe('vueToCml', function() {
    it('test-vueToCml-interation-key *this*', function() {
      let source = `<view><!-- 循环 --><view v-for="item in array" :key="item"><view>{{item.id}}{{item[11]}}</view></view></view>`
      expect(processTemplate.vueToCml(source).source).to.equal('<view><view c-for="{{array}}" c-for-item="item" c-for-index="index" c-key="*this"><view>{{item.id}}{{item[11]}}</view></view></view>');
    });
  });
  describe('vueToCml', function() {
    it('test-vueToCml-interation-nokey', function() {
      let source = `<view><!-- 循环 --><view v-for="item in array" ><view>{{item.id}}{{item[11]}}</view></view></view>`
      expect(processTemplate.vueToCml(source).source).to.equal('<view><view c-for="{{array}}" c-for-item="item" c-for-index="index"><view>{{item.id}}{{item[11]}}</view></view></view>');
    });
  });
  describe('vueToCml', function() {
    it('test-vueToCml-class', function() {
      let source = `<view><view class="cls1 cls2" :class="true ?'cls3':'cls4'"></view><view  class="cls1 cls2"></view><view  :class="true ? 'cls4' : 'cls5'"></view></view>`
      expect(processTemplate.vueToCml(source).source).to.equal(`<view><view class=" cls1 cls2 {{true ?'cls3':'cls4'}}"></view><view class=" cls1 cls2"></view><view class=" {{true ? 'cls4' : 'cls5'}}"></view></view>`);
    });
  });
  describe('vueToCml', function() {
    it('test-vueToCml-style', function() {
      let source = `<view><view style="background-color:red"></view><view :style="computedStyle"></view></view>`
      expect(processTemplate.vueToCml(source).source).to.equal(`<view><view style="background-color:red"></view><view style="{{computedStyle}}"></view></view>`);
    });
  });
  // 原生组件和 origin-tag标签
  describe('vueToCml', function() {
    it('test-vueToCml-origin-tag', function() {
      let source = `<view><button></button><third-comp1 v-on:click="click1" :class="true ? 'cls1':'cls2'"></third-comp1><third-comp2 v-on:click="click1" :class="true ? 'cls1':'cls2'"></third-comp2><origin-checkbox v-on:click="click1" :name="13"  :class="clas2" class="cls1"></origin-checkbox></view>`
      expect(processTemplate.vueToCml(source, options).source).to.equal(`<view><cml-buildin-button></cml-buildin-button><third-comp1 c-bind:tap="click1" v-bind:class="true ? 'cls1':'cls2'"></third-comp1><third-comp2 class=" {{true ? 'cls1':'cls2'}}" c-bind:tap="click1"></third-comp2><origin-checkbox c-bind:tap="click1" v-bind:name="13" v-bind:class="clas2" class="cls1"></origin-checkbox></view>`);
    });
  });
  // 一元标签
  describe('vueToCml', function() {
    it('test-vueToCml-isunary', function() {
      let source = `<view><input :id="value" v-bind:id="value" @click="handleClick" v-on:click="handleClick" /><input style="width:100px" class="cls1" :class="true ? 'cls2':'cls3'" /></view>`
      expect(processTemplate.vueToCml(source).source).to.equal(`<view><input id="{{value}}" id="{{value}}" c-bind:tap="handleClick" c-bind:tap="handleClick" /><input class=" cls1 {{true ? 'cls2':'cls3'}}" style="width:100px" /></view>`);
    });
  });
  // 单属性
  describe('vueToCml', function() {
    it('test-vueToCml-isunary', function() {
      let source = `<div disabled><input disabled :id="value" v-bind:id="value" @click="handleClick" v-on:click="handleClick" /><input style="width:100px" class="cls1" :class="true ? 'cls2':'cls3'" /></div>`
      expect(processTemplate.vueToCml(source).source).to.equal(`<div disabled><input disabled id="{{value}}" id="{{value}}" c-bind:tap="handleClick" c-bind:tap="handleClick" /><input class=" cls1 {{true ? 'cls2':'cls3'}}" style="width:100px" /></div>`);
    });
  });
  describe('preDisappearAnnotation', function() {
    it('test-preDisappearAnnotation', function() {
      let source = `<div class="hello"><!-- <div @click="handleClick">{{numStr}}</div> --></div>`
      expect(processTemplate.preDisappearAnnotation(source)).to.equal(`<div class="hello"></div>`);
    });
  });
  describe('preParseHTMLtoArray', function() {
    it('test-preParseHTMLtoArray', function() {
      let source = `<div class="hello"><div :id="value" v-bind:id="value"></div><div @click="value" v-bind:id="value"></div><input class=" cls1 {{true ? 'cls2':'cls3'}}" style="width:100px" /></div>`
      let callbacks = {startCallback: processTemplate.startCallback};
      expect(processTemplate.preParseHTMLtoArray(source, callbacks)).to.be.an('array');
    });
  });
  describe('startCallback', function() {
    it('test-startCallback', function() {
      let matchStart = {
        attrs: [
          [' :id="value"', ':id'],
          [' @click="handleClick"', "@click"],
          [' v-on:click="handleClick"', "v-on:click"]
        ]
      }
      expect(processTemplate.startCallback(matchStart)).to.be.equal(` v-bind:id="value" c-bind:tap="handleClick" c-bind:tap="handleClick"`);
    });
  });
  describe('preParseBindAttr', function() {
    it('test-preParseBindAttr', function() {
      let source = ` :id="value"`
      expect(processTemplate.preParseBindAttr(source)).to.be.equal(` v-bind:id="value"`);
    });
  });
  describe('preParseVueEvent', function() {
    it('test-preParseVueEvent-@', function() {
      let source = `@click="handleClick"`
      expect(processTemplate.preParseVueEvent(source)).to.be.equal(`c-bind:tap="handleClick"`);
    });
  });
  describe('preParseVueEvent', function() {
    it('test-preParseVueEvent-v-on', function() {
      let source = `v-on:click="handleClick"`
      expect(processTemplate.preParseVueEvent(source)).to.be.equal(`c-bind:tap="handleClick"`);
    });
  });
  describe('isOriginTagOrNativeComp', function() {
    it('test-isOriginTagOrNativeComp-isNative', function() {
      expect(processTemplate.isOriginTagOrNativeComp('third-comp1', options)).to.be.ok;
    });
  });
  describe('isOriginTagOrNativeComp', function() {
    it('test-isOriginTagOrNativeComp-isOriginTag', function() {
      expect(processTemplate.isOriginTagOrNativeComp('origin-input', options)).to.be.ok;
    });
  });
  describe('isOriginTagOrNativeComp', function() {
    it('test-isOriginTagOrNativeComp-is-not-originTag or native', function() {
      expect(processTemplate.isOriginTagOrNativeComp('span', options)).to.be.not.ok;
    });
  });
  describe('analysisFor', function() {
    it('transform  analysisFor ', function() {
      expect(processTemplate.analysisFor(`(item,index) in items`)).to.includes.keys(`item`)
      expect(processTemplate.analysisFor(`(item,index) in items`)).to.includes.keys(`index`)
      expect(processTemplate.analysisFor(`(item,index) in items`)).to.includes.keys(`list`)
    })
  });
  describe('analysisFor', function() {
    it('transform  analysisFor ', function() {
      expect(processTemplate.analysisFor(`item in items`)).to.includes.keys(`item`)
      expect(processTemplate.analysisFor(`item in items`)).to.includes.keys(`index`)
      expect(processTemplate.analysisFor(`item in items`)).to.includes.keys(`list`)
    })
  });
})
