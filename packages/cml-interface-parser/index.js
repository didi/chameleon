const parserConfig = require('./config/babel-parser-config');
const babelParser = require('@babel/parser');
const astTreeParser = require('./src/ast-tree-parser');
const fileReader = require('./src/file-reader');


class InterfaceParser {

  /**
   * Constructor
   * @param {Object} {
   *  filePath, // file that contains javascript context you wanna to parse.
   *  astTree // an ast tree object got from bable parser.
   * }
   */
  constructor({filePath = null, astTree = null}, options = null) {
    this._astTree = null;

    if (filePath) {
      this._astTree = this.getAstTreeFromFile(filePath);
    }
    if (astTree) {
      this._astTree = astTree;
    }
    if (options) {
      this._options = options;
    }
  }

  getAstTreeFromFile(filePath) {
    let content = fileReader.getContent(filePath);
    let astTree = null;
    try {
      astTree = babelParser.parse(content, this._options || parserConfig);
    } catch (err) {
      console.error(err);
    }
    return astTree;
  }

  getParseResults() {
    let results = {vars: [], methods: [], props: [], events: []};
    if (this._astTree) {
      results = astTreeParser.parse(this._astTree);
    }
    return results;
  }
}

module.exports = InterfaceParser;
