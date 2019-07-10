const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const utils = require('../../../utils');
const config = require('../../../config');
const linters = require('../../../linters');

const jsonAstParser = require('../../../checkers/template/lib/json-ast-parser');
const templateAstParser = require('../../../checkers/template/lib/template-ast-parser');


async function getParseResults(filepath) {
  let parts = {};
  let parseResults = {};
  filepath = path.resolve(__dirname, filepath);

  parts = utils.getCmlParts(filepath);
  parseResults.script = await linters.scriptlint(parts.script);
  parseResults.json = await linters.jsonlint(parts.json);
  parseResults.template = await linters.templatelint(parts.template, parseResults.json.obj);

  return {parseResults, filepath};
}

describe('template lib template', function() {
  before(async function() {
    config.init(path.resolve(__dirname));
  });

  it('should pass template ast parse process: cml', async function() {
    let filepath = '../docs/check/success/index-lib-template-cml.cml';
    let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
    let usingComponents = jsonAstParser.getUsingComponents(parseResults.json.obj, fullFilePath)
    let results = templateAstParser.getParseResults(parseResults.template.ast, {
      usingComponents: Object.keys(usingComponents),
      platform: 'cml'
    });
    expect(results).to.have.deep.property('methods', [{
      name: 'onTap',
      method: true,
      variable: false,
      pos: [8, 66]
    }, {
      name: 'onScroll',
      method: true,
      variable: false,
      pos: [8, 90]
    }], 'methods mismatch');
    expect(results).to.have.deep.property('vars', [{
      name: 'messages',
      method: false,
      variable: true,
      pos: [2, 18]
    }, {
      name: 'show',
      method: false,
      variable: true,
      pos: [5, 17]
    }, {
      name: 'childView',
      method: false,
      variable: true,
      pos: [6, 24]
    }, {
      name: 'child',
      method: false,
      variable: true,
      pos: [6, 36]
    }, {
      name: 'disX',
      method: false,
      variable: true,
      pos: [8, 46]
    }, {
      name: 'logicalLeft',
      method: false,
      variable: true,
      pos: [9, 17]
    }, {
      name: 'logicalRight',
      method: false,
      variable: true,
      pos: [9, 32]
    }, {
      name: 'eleOne',
      method: false,
      variable: true,
      pos: [10, 18]
    }, {
      name: 'eleTwo',
      method: false,
      variable: true,
      pos: [10, 26]
    }], 'variables mismatch');
    expect(results.customizedComponents[0]['show-scroller']).to.have.deep.property('props', [{
      event: false,
      name: 'scrollX',
      rawName: 'scroll-x',
      prop: true,
      pos: [8, 34]
    }], 'customized component properties check fail');

    expect(results.customizedComponents[0]['show-scroller']).to.have.deep.property('events', [{
      name: 'tap',
      event: true,
      pos: [8, 61],
      prop: false
    }, {
      name: 'onscroll',
      event: true,
      pos: [8, 80],
      prop: false
    }]);
  });

  it('should pass template ast parse process: vue', async function() {
    let filepath = '../docs/check/success/index-lib-template-vue.cml';
    let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
    let usingComponents = jsonAstParser.getUsingComponents(parseResults.json.obj, fullFilePath)
    let results = templateAstParser.getParseResults(parseResults.template.ast, {
      usingComponents: Object.keys(usingComponents),
      platform: 'vue'
    });
    expect(results).to.have.deep.property('methods', [{
      name: 'onTap',
      method: true,
      variable: false,
      pos: [8, 57]
    }, {
      name: 'onScroll',
      method: true,
      variable: false,
      pos: [8, 81]
    }], 'methods mismatch');
    expect(results).to.have.deep.property('vars', [{
      name: 'messages',
      method: false,
      variable: true,
      pos: [2, 32]
    }, {
      name: 'show',
      method: false,
      variable: true,
      pos: [5, 15]
    }, {
      name: 'childView',
      method: false,
      variable: true,
      pos: [6, 23]
    }, {
      name: 'child',
      method: false,
      variable: true,
      pos: [6, 35]
    }, {
      name: 'disX',
      method: false,
      variable: true,
      pos: [8, 41]
    }], 'variables mismatch');
    expect(results.customizedComponents[0]['show-scroller']).to.have.deep.property('props', [{
      event: false,
      name: 'scrollX',
      rawName: 'scroll-x',
      prop: true,
      pos: [8, 31]
    }], 'customized component properties check fail');

    expect(results.customizedComponents[0]['show-scroller']).to.have.deep.property('events', [{
      name: 'tap',
      event: true,
      pos: [8, 52],
      prop: false
    }, {
      name: 'onscroll',
      event: true,
      pos: [8, 71],
      prop: false
    }]);
  });
});
