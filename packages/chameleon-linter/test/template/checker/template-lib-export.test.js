const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const linters = require('../../../linters');
const checkers = require('../../../checkers');
const utils = require('../../../utils');
const config = require('../../../config');
const jsonAstParser = require('../../../checkers/template/lib/json-ast-parser');
const jsAstParser = require('../../../checkers/template/lib/js-ast-parser');
const templateAstParser = require('../../../checkers/template/lib/template-ast-parser');

describe('template lib check', function() {
  let parts = {};
  let parseResults = {};
  let filepath = path.resolve(__dirname, '../docs/check/success/index-lib-check-export.cml');
  let usingComponents = {};
  let parsedScriptResults = {};
  let parsedTemplateResults = {};

  before(async function() {
    config.init(path.resolve(__dirname, '../docs/check/success'));
    parts = utils.getCmlParts(filepath);
    parseResults.script = await linters.scriptlint(parts.script);
    parseResults.json = await linters.jsonlint(parts.json);
    parseResults.template = await linters.templatelint(parts.template, parseResults.json.obj);
  });

  it('should pass json ast parser', function() {
    usingComponents = jsonAstParser.getUsingComponents(parseResults.json.obj, filepath);
  });

  it('should pass js ast parser', function() {
    parsedScriptResults = jsAstParser.getParseResults(parseResults.script.ast);
  });

  it('should pass template parser', function() {
    parsedTemplateResults = templateAstParser.getParseResults(parseResults.template.ast, Object.keys(usingComponents));
  })
});
