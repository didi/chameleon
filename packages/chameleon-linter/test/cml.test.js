const config = require('../config');
const jsonLinter = require('../linters/json');
const styleLinter = require('../linters/style');
const scriptLinter = require('../linters/script');
const checkers = require('../checkers/index');
const utils = require('../utils');
const fileSpec = require('../file-spec');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const path = require('path');

describe('cml', function() {


  describe('lint-json', function() {
    before(async function() {
      config.init(path.resolve(__dirname, '../linter/cml/json/'));
    });
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
    before(async function() {
      config.init(path.resolve(__dirname, '../linter/cml/style/'));
    });
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

    // 支持stylus
    it('style-stylus', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/style/standard.stylus.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await styleLinter(parts.style);
      expect(result.messages).to.deep.equal([]);
    });
    // 支持stylus 错误情况
    it('style-stylus-error', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/style/no-standard.stylus.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await styleLinter(parts.style);
      expect(result.messages).to.deep.equal([
        {
          'column': 3,
          'line': 7,
          'msg': 'expected "indent", got ";"'
        }
      ]);
    });
    // 支持stylus
    it('style-important', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/style/no-standard-important.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await styleLinter(parts.style);
      expect(result.messages).to.deep.equal([]);
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
    it('nonstandard-arrow', async function () {
      const cmlPath = path.resolve(__dirname, './linter/cml/script/nonstandard-arrow.cml');
      const parts = utils.getCmlParts(cmlPath);
      const result = await scriptLinter(parts.script);
      expect(result.messages).to.deep.equal(
        [
          {
            'column': 5,
            'line': 19,
            'msg': 'computed property "hasApplyList" cannot be used as an arrow function'
          },
          {
            'column': 3,
            'line': 30,
            'msg': 'lifecycle hook "mounted" cannot be used as an arrow function'
          }
        ]
      );
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
  describe('check-interface-include', async function() {
    before(async function() {
      config.init(path.resolve(__dirname, './checker/cml/script/'));
    });
    it('should fail because of not found include interface file', async function() {
      const interfacePath = path.resolve(__dirname, './checker/cml/script/include/include-interface-fail.interface');
      const result = await fileSpec(interfacePath, 'interface');
      expect(result).to.have.property('core');
      expect(result.core.messages[0].msg).to.contain('include/include-interface-fail.interface');
      expect(result.core.file).to.equal(interfacePath);
    });
    it('should fail because of not found include src js file', async function() {
      const interfacePath = path.resolve(__dirname, './checker/cml/script/include/include-src-js-fail.interface');
      const result = await fileSpec(interfacePath, 'interface');
      expect(result).to.have.property('core');
      expect(result.core.messages[0].msg).to.contain('someplatform.js');
      expect(result.core.file).to.equal(interfacePath);
    });
    it('should fail because of not found include src cml file', async function() {
      const interfacePath = path.resolve(__dirname, './checker/cml/script/include/include-src-cml-fail.interface');
      const result = await fileSpec(interfacePath, 'interface');
      expect(result).to.have.property('core');
      expect(result.core.messages[0].msg).to.contain('someplatform.cml');
      expect(result.core.file).to.equal(interfacePath);
    });
    it('should fail test because class name mismatch', async function() {
      const interfacePath = path.resolve(__dirname, './checker/cml/script/include/include-src-js-class-name-fail.interface');
      const result = await fileSpec(interfacePath, 'interface');
      expect(result['interface'].messages[0].msg).to.contain('ExtendInterfaceInterface');
    });
    it('should fail test because missing prop', async function() {
      const interfacePath = path.resolve(__dirname, './checker/cml/script/include/include-src-js-mis-prop-fail.interface');
      const result = await fileSpec(interfacePath, 'interface');
      expect(result['interface'].messages[0].token).to.equal('setTitle');
      expect(result['interface'].messages[0].msg).to.contain('someplatform-mis-prop.js');
    });
    it('should fail test because missing prop in someplatform cml file', async function() {
      const interfacePath = path.resolve(__dirname, './checker/cml/script/include/include-src-cml-mis-prop-fail.interface');
      const result = await fileSpec(interfacePath, 'interface');
      expect(result['interface'].messages[0].token).to.equal('age');
      expect(result['interface'].messages[0].msg).to.contain('someplatform-mis-prop.cml');
    });
  });
});
