const parserConfig = require('./config/babel-parser-config');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse')['default'];
const visitors = require('./src/visitors');
const fileReader = require('./src/file-reader');


class CmlJSParser {

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
      traverse(this._astTree, {
        ExportDefaultDeclaration(path) {
          let containerPath = visitors.exportPathVisitor(path);
          if (containerPath) {
            results = visitors.containerPathVisitor(containerPath);
          }
        }
      });
    }
    return results;
  }
}

module.exports = CmlJSParser;
