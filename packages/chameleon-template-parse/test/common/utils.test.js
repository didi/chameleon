const utils = require('../../src/common/utils');
var expect = require('chai').expect;
describe('utils', function() {
  describe('trimCurly', function() {
    it('trim {{variable}} to variable', function() {
      expect(utils.trimCurly(`{{name}}`)).to.equal(`name`)
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
  describe('getStaticValueFromMixinValue', function() {
    it('getStaticValueFromMixinValue for cml', function() {
      let result = utils.getStaticValueFromMixinValue(`a b{{true? 'cls1':'cls2'}} {{variable}}b c `);
      console.log('result', result)
      expect(result).to.equal(`a b   b c `);
    })
  });
  describe('getDynamicValuefromMixinValue', function() {
    it('getDynamicValuefromMixinValue for cml', function() {
      let result = utils.getDynamicValuefromMixinValue(`a b{{true? 'cls1':'cls2'}} {{variable}}b c `);
      console.log('result', result)
      expect(result).to.equal(`{{true? 'cls1':'cls2'}}{{variable}}`);
    })
  });

})
