const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const Parser = require('../index');

describe('parser check', function() {
  it('should pass export class check', function() {
    let parser = new Parser({filePath: path.resolve(__dirname, './docs/export-class.cml')});
    let results = parser.getParseResults();
    expect(results).to.have.deep.property('vars', ['propOne', 'propTwo', 'dataOne', 'dataTwo', 'computedOne', 'computedTwo'], 'failed at checking vars');
    expect(results).to.have.deep.property('methods', ['onTap', 'onClick'], 'failed on checking methods');
    expect(results).to.have.deep.property('props', [{
      name: 'propOne', valueType: 'Object', required: true, default: ''
    }, {
      name: 'propTwo', valueType: 'Boolean', required: false, default: true
    }], 'failed at checking props');
    expect(results).to.have.deep.property('events', [{
      name: 'eventOne', paramsNum: -1, params: []
    }]);
  });

  it('should pass export default check', function() {
    let parser = new Parser({filePath: path.resolve(__dirname, './docs/export-default.cml')});
    let results = parser.getParseResults();
    expect(results).to.have.deep.property('vars', ['propOne', 'propTwo', 'dataOne', 'dataTwo', 'computedOne', 'computedTwo', 'computedShow', 'getterHide'], 'failed at checking vars');
    expect(results).to.have.deep.property('methods', ['onTap', 'onClick'], 'failed on checking methods');
    expect(results).to.have.deep.property('props', [{
      name: 'propOne', valueType: 'Object', required: true, default: ''
    }, {
      name: 'propTwo', valueType: 'Boolean', required: false, default: true
    }], 'failed at checking props');
    expect(results).to.have.deep.property('events', [{
      name: 'eventOne', paramsNum: -1, params: []
    }, {
      name: 'topevent', paramsNum: -1, params: []
    }]);
  });
});
