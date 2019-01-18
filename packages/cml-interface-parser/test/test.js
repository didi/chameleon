const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const Parser = require('../index');

describe('parser check', function() {
  it('should pass check', function() {
    let parser = new Parser({filePath: path.resolve(__dirname, './docs/index.interface')});
    let results = parser.getParseResults();
    expect(results).to.have.deep.property('vars', ['cstyle', 'bottomOffset', 'scrollDirection']);
    expect(results).to.have.deep.property('methods', ['customscroll', 'scrolltobottom']);
    expect(results).to.have.deep.property('props', [{
      name: 'cstyle', valueType: 'String', props: [], typeChain: []
    }, {
      name: 'bottomOffset', valueType: 'Number', props: [], typeChain: []
    }, {
      name: 'scrollDirection', valueType: 'String', props: [], typeChain: []
    }]);
  });
});
