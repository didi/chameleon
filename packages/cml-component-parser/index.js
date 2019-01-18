const path = require('path');
const fs = require('fs');
const readmeBuilder = require('./src/readme-builder');
const CmlAstTreeParser = require('cml-js-parser');
const InterfaceAstTreeParser = require('cml-interface-parser');
const entranceFlat = require('./src/entrance-flat');



class ComponentParser {
  constructor(filePath = '', options = null) {
    this._paseResults = {props: [], events: []};
    this._options = options;
    filePath && this.resetPath(filePath);
  }

  resetPath(filePath) {
    if (path.extname(filePath) === '.cml') {
      let cmlTreeParser = new CmlAstTreeParser({filePath}, this._options);
      this._paseResults = cmlTreeParser.getParseResults();
      this._fileName = path.basename(filePath, '.cml');
    } else {
      let interfaceTreeParser = new InterfaceAstTreeParser({filePath}, this._options);
      this._paseResults = interfaceTreeParser.getParseResults();
      this._fileName = path.basename(filePath, '.interface');
    }

    return this;
  }

  getParseResults() {
    return this._paseResults;
  }

  isResultsEmpty() {
    return !this._paseResults || (this._paseResults.props.length === 0 && this._paseResults.events.length === 0);
  }

  getJsonContent() {
    return this._paseResults && (JSON.stringify(this._paseResults, null, '\t'));
  }

  getJsonResultsWithComponentName() {
    return {
      name: this._fileName,
      content: this._paseResults
    };
  }

  writeJsonFileToDir(dirPath, fileName = '', content = '') {
    fileName = path.resolve(dirPath, (fileName || this._fileName) + '.json');
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, content || this.getJsonContent(), {
        flag: 'w'
      }, (err) => {
        if (err) {return reject(err);}
        resolve('success');
      });
    });
  }

  getReadmeContent() {
    return !this.isResultsEmpty() ? readmeBuilder.getReadmeFileContent({
      name: this._fileName,
      props: this._paseResults.props,
      events: this._paseResults.events
    }) : '';
  }


  writeReadmeFileToDir(dirPath, fileName = '', content = '') {
    fileName = path.resolve(dirPath, (fileName || this._fileName) + '.md');
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, content || this.getReadmeContent(), {
        flag: 'w'
      }, (err) => {
        if (err) {return reject(err);}
        resolve('success');
      });
    });
  }

  static flatEntrance(entrance) {
    return entranceFlat.getEntrances(entrance);
  }
}

module.exports = ComponentParser;
