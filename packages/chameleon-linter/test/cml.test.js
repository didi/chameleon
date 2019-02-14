const config = require('../config');
const jsonLinter = require('../linters/json');
const styleLinter = require('../linters/style');
const scriptLinter = require('../linters/script');
const checkers = require('../checkers/index');
const utils = require('../utils');
const fileSpec = require('../file-spec');
const chai = require('chai');
const assert = chai.assert;
const should = chai.should;
const expect = chai.expect;
const path = require('path');



describe('cml', function() {
  const projectRoot = path.resolve(__dirname, './template/docs/');
  config.init(projectRoot);
  
  describe('lint-json', function() {
    it('json-standard', async function() {
      const cmlPath = path.resolve(__dirname, './linter/cml/json/standard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await jsonLinter(parts.json);
      assert.equal(result.messages.length, 0);
    });

    it('json-no-quotes', async function() {
      const cmlPath = path.resolve(__dirname, './linter/cml/json/no-quotes.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await jsonLinter(parts.json);
      expect(result.messages).to.deep.equal([{
        line: 9,
        column: 7,
        token: 'b',
        msg: 'Unknown Character \'b\', expecting a string for key statement.'
      }]);
    });

    it('json-no-bracket', async function() {
      const cmlPath = path.resolve(__dirname, './linter/cml/json/no-bracket.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await jsonLinter(parts.json);
      expect(result).to.deep.equal({
        start: 1,
        ast: null,
        obj: null,
        messages: [
          {
            line: 16,
            column: 0,
            token: '\n',
            msg: 'EOF Error, expecting closing \'}\'.'
          }
        ]
      });
    });

    it('json-no-comma', async function() {
      const cmlPath = path.resolve(__dirname, './linter/cml/json/no-comma.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await jsonLinter(parts.json);
      expect(result).to.deep.equal({
        start: 1,
        ast: null,
        obj: null,
        messages: [
          {
            line: 7,
            column: 3,
            token: '"',
            msg: 'Unknown Character \'"\', expecting a comma or a closing \'}\''
          }
        ]
      });
    });
  });


  describe('lint-style', function () {

    it('style-standard', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/style/standard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await styleLinter(parts.style);
      assert.equal(result.messages.length, 0);
    });

    it('style-no-bracket', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/style/no-bracket.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await styleLinter(parts.style);

      expect(result.messages).to.deep.equal([{
        line: 4,
        column: 1,
        msg: 'Unclosed block '
      }]);
    });

    // 支持嵌套(未来)
    it('style-nest', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/style/nest.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await styleLinter(parts.style);
      expect(result.messages).to.deep.equal([{
        line: 11,
        column: 3,
        msg: 'Expected ".app-root .a" to have no more than 1 compound selector ' }
      ]);
    });

    // 缺少分号
    it('style-no-semicolon', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/style/no-semicolon.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await styleLinter(parts.style);
      expect(result.messages).to.deep.equal(
        [
          {
            column: 8,
            line: 6,
            msg: 'Missed semicolon '
          }
        ]
      );
    });
  });

  describe('lint-script', function () {

    it('standard', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/script/standard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await scriptLinter(parts.script);
      assert.equal(result.messages.length, 0);
    });

    it('nonstandard', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/script/nonstandard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await scriptLinter(parts.script);
      expect(result.messages).to.deep.equal([
        {
          line: 12,
          column: 3,
          msg: 'Unexpected token, expected ","'
        }
      ]);
    });
    it('syntax-error', async function () {
      const projectRoot = path.resolve(__dirname, './template/docs/');
      config.init(projectRoot);

      const cmlPath = path.resolve(__dirname, './linter/cml/cml/syntaxError/standard.weex.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.script(result);
      expect(result.script.messages).to.deep.equal([
        {
          'column': 3,
          'line': 14,
          'msg': 'Unexpected token, expected \",\"'
        }
      ]);
    });
  });

  describe('lint-cml-file', function () {
    it('standard-single-file-spec', async function () {
      const projectRoot = path.resolve(__dirname, './checker/cml/cml');
      config.init(projectRoot);

      const cmlPath = path.resolve(__dirname, './linter/cml/cml/standard.cml');
      const result = await fileSpec(cmlPath, 'cml');

      let flag = false;
      Object.keys(result).forEach(key => {
        if (result[key].messages.length) {
          flag = true;
        }
      });

      assert.equal(flag, false);
    });
    it('standard-single-file', async function () {
      const projectRoot = path.resolve(__dirname, './template/docs/');
      config.init(projectRoot);
      const cmlPath = path.resolve(__dirname, './linter/cml/cml/standard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);

      let flag = false;
      Object.keys(result).forEach(key => {
        if (result[key].messages.length) {
          flag = true;
        }
      });

      assert.equal(flag, false);
    });
    it('standard-multi-file', async function () {
      const projectRoot = path.resolve(__dirname, './template/docs/');
      config.init(projectRoot);

      const cmlPath = path.resolve(__dirname, './linter/cml/cml/standard/standard.wx.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      let flag = false;
      Object.keys(result).forEach(key => {
        if (result[key].messages.length) {
          flag = true;
        }
      });

      assert.equal(flag, false);
    });
    it('nonstandard', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/cml/nonstandard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);

      let flag = false;
      Object.keys(result).forEach(key => {
        if (result[key].messages.length) {
          flag = true;
        }
      });
      assert.equal(flag, true);
    });
  });

  describe('check-json', function () {
    it('standard', async function () {
      const cmlPath = path.resolve(__dirname, './checker/cml/json/standard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.json(result);

      expect(result.json.messages).to.deep.equal([]);
    });
    it('nonstandard', async function () {
      const cmlPath = path.resolve(__dirname, './checker/cml/json/nonstandard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.json(result);

      expect(result.json.messages).to.deep.equal([
        {
          'column': 4,
          'line': 4,
          'msg': 'Useless fields: weex.usingComponents',
          'token': 'weex.usingComponents'
        }
      ]);
    });
    it('nonstandard-distinguish-platform', async function () {
      const cmlPath = path.resolve(__dirname, './checker/cml/json/nonstandard.wx.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.json(result);
      expect(result.json.messages).to.deep.equal([{
        'column': 2,
        'line': 16,
        'msg': 'Useless fields: weex',
        'token': 'weex'
      }]);
    });


    it('nonstandard-component-was-not-found', async function () {
      const projectRoot = path.resolve(__dirname, './checker/cml/json');
      config.init(projectRoot);

      const cmlPath = path.resolve(__dirname, './checker/cml/json/nonstandard.weex.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.json(result);
      expect(result.json.messages).to.deep.equal([{
        column: 20,
        line: 5,
        msg: 'component: [chameleon-ui-builtin/components/scroller/scroller] is not found',
        token: 'base.usingComponents.c-scroller'
      }]);
    });
  });
  describe('check-script', function () {
    it('standard', async function () {
      const cmlPath = path.resolve(__dirname, './checker/cml/script/standard/standard.wx.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.script(result);

      expect(result.script.messages).to.deep.equal([]);
    });
    it('no-interface', async function () {
      const cmlPath = path.resolve(__dirname, './checker/cml/script/nointerface/nonstandard.wx.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.script(result);
      assert.equal(result['interface'].messages.length, 1);
    });
    it('global-variable', async function () {
      const cmlPath = path.resolve(__dirname, './checker/cml/script/global-variable/standard.wx.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.script(result);
      assert.equal(result.script.messages.length, 1);
    });
    it('no-global-variable', async function () {
      const cmlPath = path.resolve(__dirname, './checker/cml/script/no-global-variable/standard.wx.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.script(result);
      assert.equal(result.script.messages.length, 0);
    });
    it('global-variable-xx', async function () {
      const cmlPath = path.resolve(__dirname, './checker/cml/script/standard.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await fileSpec.lintCmlFile(parts);
      checkers.script(result);
      assert.equal(result.script.messages.length, 0);
    });
  });
});
