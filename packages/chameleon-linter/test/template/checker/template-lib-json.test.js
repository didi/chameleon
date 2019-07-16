const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const utils = require('../../../utils');
const config = require('../../../config');
const linters = require('../../../linters');

const jsonAstParser = require('../../../checkers/template/lib/json-ast-parser');

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

describe('template lib json', function() {
  let scrollerPath = path.resolve(__dirname, '../docs/components/scroller/scroller.interface');
  let radioPath = path.resolve(__dirname, '../docs/components/radio/radio.cml');

  before(async function() {
    config.init(path.resolve(__dirname));
  });

  it('should pass template lib json process: polymorphic model', async function() {
    let filepath = '../docs/check/success/index-lib-json-polymorphic.cml';
    let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
    let results = jsonAstParser.getUsingComponents(parseResults.json.obj, fullFilePath);
    expect(results).to.have.property('c-scroller');
    expect(results['c-scroller']).to.have.deep.property('vars', ['cstyle', 'bottomOffset', 'scrollDirection']);
    expect(results['c-scroller']).to.have.deep.property('methods', ['customscroll', 'scrolltobottom']);
    expect(results['c-scroller']).to.have.nested.property('events[0].name', 'customscroll');
    expect(results['c-scroller']).to.have.property('path', scrollerPath);
  });

  it('should pass template lib json process: single file model', async function() {
    let filepath = '../docs/check/success/index-lib-json-single.cml';
    let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
    let results = jsonAstParser.getUsingComponents(parseResults.json.obj, fullFilePath);
    expect(results).to.have.property('c-radio');
    expect(results['c-radio']).to.have.deep.property('vars', ['checked']);
    expect(results['c-radio']).to.have.deep.property('methods', ['check']);
    expect(results['c-radio']).to.have.nested.property('events[0].name', 'radiocheked');
    expect(results['c-radio']).to.have.property('path', radioPath);
  });

  it('should pass plugin:// prefix component test', async function() {
    let filepath = '../docs/check/success/index-lib-check-plugin.cml';
    let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
    let results = jsonAstParser.getUsingComponents(parseResults.json.obj, fullFilePath);
    expect(results).to.have.property('c-radio');
    expect(results).to.not.have.property('c-plugin');
  })
});
