var _ = require('../index.js');
var expect = require('chai').expect;

describe('mvvm-template-parser', function() {
  it('cmlparse', function() {
    let content = `
    <view c-if="show">
      <view c-bind:click="click"></view>
      <view name="{{name}}"></view>
      <view c-for="list"></view>
    </view>
    `
    let result = _.cmlparse(content);
    expect(typeof result).to.be.equal('object')
  });

  it('postParseUnicode', function() {
    let content = `\u4f60\u597d`;
    let result = _.postParseUnicode(content);
    expect(result).to.be.equal('你好')
  });

  it('generator', function() {

    let content = `
    <view c-if="show">
      <view c-bind:click="click"></view>
      <view name="{{name}}"></view>
      <view c-for="list"></view>
    </view>
    `
    let result = _.cmlparse(content);
    let code = _.generator(result).code;
    console.log(code)
    expect(code).to.be.equal('<view c-if="show">\n      <view c-bind:click="click"></view>\n      <view name="{{name}}"></view>\n      <view c-for="list"></view>\n    </view>')
  });
})