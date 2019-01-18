const fs = require('fs');
const config = require('../../config');
const Parser = require('cml-component-parser');
const parser = new Parser(null, config.getParserConfig().script);

let getCml = function () {
  let result = {};
  let inDir = config.getCurrentWorkspace() + '/node_modules/chameleon-ui-builtin/components';

  if (fs.existsSync(inDir)) {
    Parser.flatEntrance(inDir).forEach(filterFile => {
      let content = parser.resetPath(filterFile).getJsonResultsWithComponentName();
      content && (result[content.name] = content.content);
    });
  }
  return result;
}

module.exports = {
  getCml
};
