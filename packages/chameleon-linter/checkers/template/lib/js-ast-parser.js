const CmlJsAstTreeParser = require('cml-js-parser');
const config = require('../../../config');

function getParseResults(astTree) {
  let parser = new CmlJsAstTreeParser({astTree}, config.getParserConfig().script);
  return parser.getParseResults();
}

module.exports = {
  getParseResults
}
