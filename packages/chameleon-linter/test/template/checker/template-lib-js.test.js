const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const utils = require('../../../utils');
const config = require('../../../config');
const linters = require('../../../linters');

const jsAstParser = require('../../../checkers/template/lib/js-ast-parser');


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

describe('template lib js', function() {
  before(function() {
    config.init(path.resolve(__dirname));
  });

  it('should pass template lib js: class model', async function() {
    let filepath = '../docs/check/success/index-lib-js-class.cml';
    let {parseResults} = await getParseResults(filepath);
    let results = jsAstParser.getParseResults(parseResults.script.ast);
    expect(results).to.have.deep.property('vars', ['show', 'dataOne', 'computedOne', 'computedTwo']);
    expect(results).to.have.deep.property('methods', ['onTap', 'onClick']);
  });

  it('should pass template lib js: export model', async function() {
    let filepath = '../docs/check/success/index-lib-js-export.cml';
    let {parseResults} = await getParseResults(filepath);
    let results = jsAstParser.getParseResults(parseResults.script.ast);
    expect(results).to.have.deep.property('vars', ['show', 'dataOne', 'computedOne', 'computedTwo', 'computedShow', 'getterHide']);
    expect(results).to.have.deep.property('methods', ['onTap', 'onClick']);
  });
});
