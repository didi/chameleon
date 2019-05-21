const mixins = require('../wx-mixins.js').mixins.methods;
const {expect} = require('chai');

describe('wx-mixins.js', function() {
  it('test $cmlEmit', function() {
    let thisArg = {
      triggerEvent: function() {

      },
      $__checkCmlEmit__: function() {

      }
    }
    expect(mixins.$cmlEmit.call(thisArg, 'handleTouchStart', {detail: 'detail'})).to.be.not.ok
  });
  it('test _cmlInline', function() {
    let e = {
      type: 'touchstart',
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
    expect(mixins._cmlInline.call(thisArg, e)).to.be.not.ok
  });
  it('test _cmlModelEventProxy', function() {
    let e = {
      type: 'touchstart',
      currentTarget: {
        dataset: {
          modelkey: 'key'
        }
      },
      detail: {
        value: "detailValue"
      }
    }
    let thisArg = {
      key: 'modelKey'
    }
    expect(mixins._cmlModelEventProxy.call(thisArg, e)).to.be.not.ok
  });
  it('test _cmlEventProxy', function() {
    let e = {
      type: 'touchstart',
      currentTarget: {
        dataset: {
          eventtouchstart: ['handleTouchStart']
        }
      }
    }
    let thisArg = {
      handleTouchStart: function() {

      }
    }
    expect(mixins._cmlEventProxy.call(thisArg, e)).to.be.not.ok
  });
  it('test styleProxyName function:aimed to transfrom px to rpx', function() {
    expect(mixins.$cmlStyle('width:75cpx;height:50cpx;')).to.be.equal(`width:75rpx;height:50rpx`);
    expect(mixins.$cmlStyle({ width: '75cpx', height: '50cpx' })).to.be.equal(`width:75rpx;height:50rpx`);
  });
  it('test $cmlMergeStyle function', function() {
    let cssString = 'background-color:red; width:100px; ';
    let cssObj1 = {height: '200px;', 'font-size': '30px'};
    let cssObj2 = {color: 'red'};
    let mergeResult = mixins.$cmlMergeStyle(cssString, cssObj1, cssObj2);
    expect(mergeResult).to.be.equal(`background-color:red;width:100px;height:200px;;font-size:30px;color:red;`);
  });
  // _animationCb
  it('test _animationCb', function() {
    let e = {
      animationValue: 'animationValue'
    }
    let thisArg = {
      animationValue: {
        cbs: [function() {}],
        index: 0
      }
    }
    expect(mixins._animationCb.call(thisArg, e)).to.be.not.ok
  });
  it('test _animationCb', function() {
    let e = {
      animationValue: 'animationValue'
    }
    let thisArg = {
      animationValue: {
        index: 1
      }
    }
    expect(mixins._animationCb.call(thisArg, e)).to.be.not.ok
  });
  it('test _animationCb', function() {
    let e = {
      animationValue: 'animationValue'
    }
    let thisArg = {
      animationValue: {
        cbs: [function() {}]
      }
    }
    expect(mixins._animationCb.call(thisArg, e)).to.be.not.ok
  });
})
