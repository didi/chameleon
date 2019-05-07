const utils = require('../../src/common/utils');
var expect = require('chai').expect;
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
describe('utils', function() {
  describe('trimCurly', function() {
    it('trim {{variable}} to variable', function() {
      expect(utils.trimCurly(`{{name}}`)).to.equal(`name`)
    })
  });
  // 驼峰化
  describe('camelize', function() {
    it('transform ab-c to abC', function() {
      expect(utils.camelize(`abc-de-f`)).to.equal(`abcDeF`)
    })
  });
  // 中划线化
  describe('dasherise', function() {
    it('transform  abcDeF to abc-de-f', function() {
      expect(utils.dasherise(`abcDeF`)).to.equal(`abc-de-f`)
    })
  });
  describe('analysisFor', function() {
    it('transform  analysisFor ', function() {
      expect(utils.analysisFor(`(item,index) in items`)).to.includes.keys(`item`)
      expect(utils.analysisFor(`(item,index) in items`)).to.includes.keys(`index`)
      expect(utils.analysisFor(`(item,index) in items`)).to.includes.keys(`list`)
    })
  });
  describe('analysisFor', function() {
    it('transform  analysisFor ', function() {
      expect(utils.analysisFor(`item in items`)).to.includes.keys(`item`)
      expect(utils.analysisFor(`item in items`)).to.includes.keys(`index`)
      expect(utils.analysisFor(`item in items`)).to.includes.keys(`list`)
    })
  });
  describe('getModelKey', function() {
    it('trim {{ variable }} to variable', function() {
      expect(utils.getModelKey(`{{ name }}`)).to.equal(`name`)
    })
  });
  describe('titleLize', function() {
    it(`titleLize a word asked for that the word cant't start with space character`, function() {
      expect(utils.titleLize('name')).to.equal(`Name`)
    })
  });
  describe('trim', function() {
    it(`trim the word`, function() {
      expect(utils.trim(' beTrimed ')).to.equal('beTrimed');
    })
  });
  describe('isInlineStatementFn', function() {
    it(`judge if the expression is inlineStatement`, function() {
      expect(utils.isInlineStatementFn(`c-bind:click="handleClick(item,1,'1',  'index')"`)).to.be.an('array');
    })
  });
  describe('isInlineStatementFn', function() {
    it(`judge if the expression is inlineStatement`, function() {
      expect(utils.isInlineStatementFn(`c-bind:click="handleClick"`)).to.not.be.ok;
    })
  })
  describe('isReactive', function() {
    it('judge if the arguments is reactive', function() {
      expect(utils.isReactive(`'index'`)).to.be.an('array')
    })
  });
  describe('isReactive', function() {
    it('judge if the arguments is not reactive', function() {
      expect(utils.isReactive(`'index'+1`)).to.not.be.ok;
    })
  });
  describe('doublequot2singlequot', function() {
    it('transform doublequot to singlequot', function() {
      expect(utils.doublequot2singlequot(`"name"`)).to.equal(`'name'`)
    })
  });
  describe('isMustacheReactive', function() {
    it('judge if the value is Reactive', function() {
      expect(utils.isMustacheReactive(`{{value}}`)).to.equal(true)
    })
  });
  describe('isOnlySpaceContent', function() {
    it('judge if the value is only space key', function() {
      expect(utils.isOnlySpaceContent('   ')).to.be.ok;
    })
  });
  describe('getReactiveValue', function() {
    it('getReactiveValue for vue:such as {{value}} to (value)', function() {
      expect(utils.getReactiveValue(`{{value1+value2}}`)).to.equal(`(value1+value2)`);
    })
  });
  describe('getReactiveValue', function() {
    it(`getReactiveValue for vue:such as main-{{index}} to 'main-'+(value)`, function() {
      expect(utils.getReactiveValue(`main-{{value1+value2}}`)).to.equal(`'main-'+(value1+value2)`);
    })
  });
  describe('getStaticValueFromMixinValue', function() {
    it('getStaticValueFromMixinValue for cml', function() {
      let result = utils.getStaticValueFromMixinValue(`a b{{true? 'cls1':'cls2'}} {{variable}}b c `);
      expect(result).to.equal(`a b   b c `);
    })
  });
  describe('transformWxDynamicStyleCpxToRpx', function() {
    it('cml-syanx:transformWxDynamicStyleCpxToRpx for wx dynamic style', function() {
      let result = utils.transformWxDynamicStyleCpxToRpx(`height:100cpx;{{'width:'+cpx+'cpx;'+'height:'+cpx2+'cpx;background-color:red;'}}height:200cpx;width:100cpx;`);
      expect(result).to.equal(`height:100rpx;{{'width:' + cpx + 'rpx;' + 'height:' + cpx2 + 'rpx;background-color:red;'}}height:200rpx;width:100rpx;`);
    })
  });
  describe('transformWxDynamicStyleCpxToRpx', function() {
    it('vue-syanx:ransformWxDynamicStyleCpxToRpx for wx dynamic style', function() {
      let result = utils.transformWxDynamicStyleCpxToRpx(`{{'width:'+cpx+'cpx;'+'height:'+cpx2+'cpx;background-color:red'}}`);
      expect(result).to.equal(`{{'width:' + cpx + 'rpx;' + 'height:' + cpx2 + 'rpx;background-color:red'}}`);
    })
  });
  // getInlineStatementArgs
  describe('getInlineStatementArgs', function() {
    it('getInlineStatementArgs', function() {
      let result = utils.getInlineStatementArgs("1,'index'+1,$event,'item',index+1,item");
      expect(result).to.equal(`1,'index'+1,'$event','item',index+1,item`);
    })
  });
  describe('isOriginTagOrNativeComp', function() {
    it('isOriginTagOrNativeComp-nativecomp', function() {
      let result = utils.isOriginTagOrNativeComp('thirdComp1', options);
      expect(result).to.be.ok;
    });
    it('isOriginTagOrNativeComp-origin-tag', function() {
      let result = utils.isOriginTagOrNativeComp('origin-tag', options);
      expect(result).to.be.ok;
    });
    it('isOriginTagOrNativeComp-not-nativecomp', function() {
      let result = utils.isOriginTagOrNativeComp('thirdComp2', options);
      expect(result).to.be.not.ok;
    });
    it('isusualComp', function() {
      let result = utils.isOriginTagOrNativeComp('view', options);
      expect(result).to.be.not.ok;
    });
  });
  // 不是对应端的原生组件
  describe('isNotNativeComponent', function() {
    it('isNotNativeComponent-nativecomp', function() {
      let result = utils.isNotNativeComponent('cml-buildin-button', options);
      expect(result).to.be.ok;
    });
    it('isNotNativeComponent-not-nativecomp', function() {
      let result = utils.isNotNativeComponent('thirdComp1', options);
      expect(result).to.be.not.ok;
    });
    it('isNotNativeComponent', function() {
      let result = utils.isNotNativeComponent('thirdComp2', options);
      expect(result).to.be.ok;
    });
    it('isNotNativeComponent', function() {
      let result = utils.isNotNativeComponent('view', options);
      console.log('result-isNotNativeComponent', result)
      expect(result).to.be.not.ok;
    });
  });
})
