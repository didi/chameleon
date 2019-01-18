const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const config = require('../../../config');
const linters = require('../../../linters');
const checkers = require('../../../checkers');
const utils = require('../../../utils');

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

function resortIssues(issues = []) {
  return issues.sort((pre, next) => {
    return pre.line * 1000 + pre.column - next.line * 1000 - next.column;
  });
}

describe('template check', function() {
  let scrollerPath = path.resolve(__dirname, '../docs/components/scroller/scroller.interface');

  before(function() {
    config.init(path.resolve(__dirname));
  });

  describe('template language: cml', async function() {
    it('should report variable and method not defined error', async function() {
      let filepath = '../docs/check/fail/index-vars-methods-cml.cml';
      let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
      let templateChecker = new checkers.Template(fullFilePath, parseResults);
      expect(resortIssues(templateChecker.check())).to.be.an.instanceOf(Array).to.deep.equal([{
        line: 2,
        column: 17,
        msg: 'variable: "showFirstView" is not defined.',
        token: 'showFirstView'
      }, {
        line: 2,
        column: 33,
        msg: 'variable: "show" is not defined.',
        token: 'show'
      }, {
        line: 2,
        column: 40,
        msg: 'variable: "hidden" is not defined.',
        token: 'hidden'
      }, {
        line: 3,
        column: 23,
        msg: 'method: "onTap" is not defined.',
        token: 'onTap'
      }]);
    });

    it('should report props and events not defined error', async function() {
      let filepath = '../docs/check/fail/index-props-events-cml.cml';
      let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
      let templateChecker = new checkers.Template(fullFilePath, parseResults);
      expect(resortIssues(templateChecker.check())).to.be.an.instanceOf(Array).to.deep.equal([{
        line: 2,
        column: 43,
        msg: `The property "top-offset" is not a property of component "show-scroller" which path is: ${scrollerPath}`,
        token: 'top-offset'
      }, {
        line: 2,
        column: 104,
        msg: `The event "scrolltotop" is not defined in component "show-scroller" which path is: ${scrollerPath}`,
        token: 'scrolltotop'
      }]);
    });
  });

  describe('template language: vue', async function() {
    it('should report variable and method not defined error', async function() {
      let filepath = '../docs/check/fail/index-vars-methods-vue.cml';
      let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
      let templateChecker = new checkers.Template(fullFilePath, parseResults);
      expect(resortIssues(templateChecker.check())).to.be.an.instanceOf(Array).to.deep.equal([{
        line: 2,
        column: 15,
        msg: 'variable: "showFirstView" is not defined.',
        token: 'showFirstView'
      }, {
        line: 2,
        column: 31,
        msg: 'variable: "show" is not defined.',
        token: 'show'
      }, {
        line: 2,
        column: 38,
        msg: 'variable: "hidden" is not defined.',
        token: 'hidden'
      }, {
        line: 2,
        column: 65,
        msg: 'variable: "font" is not defined.',
        token: 'font'
      }, {
        line: 3,
        column: 21,
        msg: 'method: "onTap" is not defined.',
        token: 'onTap'
      }]);
    });

    it('should report props and events not defined error', async function() {
      let filepath = '../docs/check/fail/index-props-events-vue.cml';
      let {parseResults, filepath: fullFilePath} = await getParseResults(filepath);
      let templateChecker = new checkers.Template(fullFilePath, parseResults);
      expect(resortIssues(templateChecker.check())).to.be.an.instanceOf(Array).to.deep.equal([{
        line: 4,
        column: 12,
        msg: `The property "top-offset" is not a property of component "show-scroller" which path is: ${scrollerPath}`,
        token: 'top-offset'
      }, {
        line: 6,
        column: 10,
        msg: `The event "scrolltotop" is not defined in component "show-scroller" which path is: ${scrollerPath}`,
        token: 'scrolltotop'
      }, {
        line: 7,
        column: 15,
        msg: `The property "data-show" is not a property of component "show-scroller" which path is: ${scrollerPath}`,
        token: 'data-show'
      }]);
    });
  });
});
