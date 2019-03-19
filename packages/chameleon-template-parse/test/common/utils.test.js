const utils = require('../../src/common/utils');
var expect = require('chai').expect;
describe('utils', function() {
  describe('trimCurly', function() {
    it('trim {{variable}} to variable', function() {
      expect(utils.trimCurly(`{{name}}`)).to.equal(`name`)
    })
  });
  //驼峰化
  describe('camelize', function() {
    it('transform ab-c to abC' , function() {
      expect(utils.camelize(`abc-de-f`)).to.equal(`abcDeF`)
    })
  });
  //中划线化
  describe('dasherise', function() {
    it('transform  abcDeF to abc-de-f' , function() {
      expect(utils.dasherise(`abcDeF`)).to.equal(`abc-de-f`)
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
  describe('getDynamicValuefromMixinValue', function() {
    it('getDynamicValuefromMixinValue for cml', function() {
      let result = utils.getDynamicValuefromMixinValue(`a b{{true? 'cls1':'cls2'}} {{variable}}b c `);
      expect(result).to.equal(`{{true? 'cls1':'cls2'}}{{variable}}`);
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

})
