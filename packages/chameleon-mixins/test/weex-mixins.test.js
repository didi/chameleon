const mixins = require('../weex-mixins.js').mixins.methods;
const {expect} = require('chai');

describe('weex-mixins.js', function() {
  it('test _cmlInlineStatementEventProxy', function() {
    let e = {
      type: 'touchstart',
      target: {

      },
      stopPropagation: function() {},
      timestamp: 3795662,

      currentTarget: {
        dataset: {
          eventtouchstart: ['handleTouchStart', '$event', 1]
        }
      },
      touches: [{
        identifier: 'identifier',
        pageX: 'pageX',
        pageY: 'pageY',
        screenX: 'screenX',
        screenY: 'screenY'
      }],
      changedTouches: [{
        identifier: 'identifier',
        pageX: 'pageX',
        pageY: 'pageY',
        screenX: 'screenX',
        screenY: 'screenY'
      }]
    }
    let thisArg = {
      handleTouchStart: function() {

      }
    }
    expect(mixins._cmlInlineStatementEventProxy.call(thisArg, 'handleTouchStart', true, 1, e)).to.be.not.ok
  });
  it('test _cmlModelEventProxy', function() {
    let e = {
      type: 'touchstart',
      target: {

      },
      stopPropagation: function() {},
      timestamp: 3795662,

      currentTarget: {
        dataset: {
          eventtouchstart: ['handleTouchStart', '$event', 1]
        }
      }
    }
    let thisArg = {
      key: 'modelKey'
    }
    expect(mixins._cmlModelEventProxy.call(thisArg, e, 'key')).to.be.not.ok
  });
  it('test _cmlEventProxy', function() {
    let e = {
      type: 'touchstart',
      target: {

      },
      stopPropagation: function() {},
      timestamp: 3795662,

      currentTarget: {
        dataset: {
          eventtouchstart: ['handleTouchStart', '$event', 1]
        }
      }
    }
    let thisArg = {
      handleTouchStart: function() {

      }
    }
    expect(mixins._cmlEventProxy.call(thisArg, e, 'handleTouchStart', true)).to.be.not.ok
  });
  it('test $cmlEmit', function() {
    let thisArg = {
      $emit: function() {

      },
      $__checkCmlEmit__: function() {

      }
    }
    expect(mixins.$cmlEmit.call(thisArg, 'handleTouchStart', {detail: 'detail'})).to.be.not.ok
  });

  it('test styleProxyName function:aimed to transform cssStyle string to cssStyle Object', function() {
    expect(mixins._cmlStyleProxy('width:75px; ;height:50px; ')).to.be.deep.equal({ width: '75px', height: '50px' });
    expect(mixins._cmlStyleProxy({ width: '75px', height: '50px' })).to.be.deep.equal({ width: '75px', height: '50px' });
  });
  it('test $cmlMergeStyle function', function() {
    let cssString = 'background-color:red; width:100px; ';
    let cssObj1 = {height: '200px;', 'font-size': '30px'};
    let cssObj2 = {color: 'red'};
    let mergeResult = mixins.$cmlMergeStyle(cssString, cssObj1, cssObj2);
    expect(mergeResult).to.be.equal(`background-color:red;width:100px;height:200px;;font-size:30px;color:red;`);
  });
  it('test weexClassProxy array function', function() {
    let result = mixins._weexClassProxy(['str1', 'str2']);
    expect(result).to.include('str1')
    expect(result).to.include('str2')
  });
  it('test weexClassProxy array function', function() {
    let result = mixins._weexClassProxy({str1: 'str1', str2: 'str2'});
    expect(result).to.include('str1')
    expect(result).to.include('str2')
  });

})
