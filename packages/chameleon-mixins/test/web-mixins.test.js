const mixins = require('../web-mixins.js').mixins.methods;
const {expect} = require('chai');
let eventEmittter = require('events')
let e = {
  type: 'touchstart',
  target: {

  },
  stopPropagation: function() {},
  timeStamp: 3795662,

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
describe('web-mixins.js', function() {
  it('test _cmlInlineStatementEventProxy', function() {
    global.Event = eventEmittter
    let thisArg = {
      handleTouchStart: function() {

      }
    }
    expect(mixins._cmlInlineStatementEventProxy.call(thisArg, 'handleTouchStart', true, e)).to.be.not.ok
  });
  it('test _cmlModelEventProxy', function() {
    let thisArg = {
      key: 'modelKey'
    }
    expect(mixins._cmlModelEventProxy.call(thisArg, e, 'key')).to.be.not.ok
  });
  it('test _cmlEventProxy', function() {
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
  it('test styleProxyName function:aimed to transform cssStyle object to cssStyle string', function() {
    expect(mixins.$cmlStyle('width:100px;')).to.be.equal('width:100px;')
    expect(mixins.$cmlStyle({width: '100px'})).to.be.equal('width:100px;')
  });
  it('test $cmlMergeStyle function', function() {
    let cssString = 'background-color:red; width:100px; ';
    let cssObj1 = {height: '200px;', 'font-size': '30px'};
    let cssObj2 = {color: 'red'};
    let mergeResult = mixins.$cmlMergeStyle(cssString, cssObj1, cssObj2);
    expect(mergeResult).to.be.equal(`background-color:red;width:100px;height:200px;;font-size:30px;color:red;`);
  });

})
