const chai = require('chai');
const path = require('path');
const expect = chai.expect;
const templateLinter = require('../../../linters/template');
const config = require('../../../config');

let failCases = require('./cases/fail');
let passCases = require('./cases/pass');

describe('template lint', function() {

  before(function() {
    config.init(path.resolve(__dirname, '../docs'));
  });

  describe('fail cases', function() {
    failCases.forEach(function(caseItem) {
      it(caseItem.desc, async function() {
        let results = await templateLinter(caseItem.input.part, caseItem.input.jsonAst);
        expect(results).to.have.property('messages').to.be.an.instanceOf(Array).to.deep.equal(caseItem.output.messages);
      });
    });
  });

  describe('pass cases', function() {
    passCases.forEach(function(caseItem) {
      it(caseItem.desc, async function() {
        let results = await templateLinter(caseItem.input.part, caseItem.input.jsonAst);
        expect(results).to.have.property('messages').to.be.an.instanceOf(Array).to.deep.equal(caseItem.output.messages);
      });
    });
  });
});
