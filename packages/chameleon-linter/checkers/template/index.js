const jsAstParser = require('./lib/js-ast-parser');
const templateAstParser = require('./lib/template-ast-parser');
const jsonAstParser = require('./lib/json-ast-parser');
const commonEvents = require('../../config/common-events.json');

class TemplateChecker {

  /**
     * constructor
     * @param {Object} trees
     * {
     *    templateAst: {},
     *    scriptAst: {},
     *    jsonAst: {}
     * }
     */
  constructor(filePath = '', lintedResult = {}) {
    this._filePath = filePath;
    this._platform = lintedResult.template.platform;

    this._templateAst = lintedResult.template.ast;
    this._scriptAst = lintedResult.script.ast;
    this._jsonAst = lintedResult.json.obj;

    this._parsedTemplateResults = '';
    this._parsedScriptResults = '';
    this._usingComponents = '';

    this.parseAllParts();
  }

  parseAllParts() {
    this._usingComponents = jsonAstParser.getUsingComponents(this._jsonAst, this._filePath);
    this._parsedScriptResults = jsAstParser.getParseResults(this._scriptAst);
    this._parsedTemplateResults = templateAstParser.getParseResults(this._templateAst, {
      usingComponents: Object.keys(this._usingComponents),
      platform: this._platform
    });
  }

  checkCustomizedComponents() {
    let issues = [];
    let usingComponents = this._usingComponents;
    let customizedComponets = this._parsedTemplateResults.customizedComponents;

    customizedComponets.forEach((component) => {
      Object.entries(component).forEach((compInfo) => {
        let compName = compInfo[0];
        if (usingComponents[compName] && usingComponents[compName].isCml) {
          let { props, events } = component[compName];
          let { props: usingProps, events: usingEvents } = usingComponents[compName];
          usingProps = usingProps
            .map((prop) => prop.name)
            .join('|');
          usingEvents = usingEvents
            .map((event) => event.name)
            .concat(commonEvents.events)
            .join('|');
          usingProps = `|${usingProps}|`;
          usingEvents = `|${usingEvents}|`;
          debugger
          props.filter((prop) => usingProps.indexOf('|' + prop.name + '|') === -1).forEach((prop) => {
            issues.push({
              line: prop.pos[0],
              column: prop.pos[1],
              token: prop.rawName,
              msg: `The property "${prop.rawName}" is not a property of component "${compName}" which path is: ${usingComponents[compName].path}`
            });
          });

          events.filter((event) => usingEvents.indexOf('|' + event.name + '|') === -1).forEach((event) => {
            issues.push({
              line: event.pos[0],
              column: event.pos[1],
              token: event.name,
              msg: `The event "${event.name}" is not defined in component "${compName}" which path is: ${usingComponents[compName].path}`
            });
          });
        }
      });
    });

    return issues;
  }

  checkTemplateAndScript() {
    let jsAstResults = this._parsedScriptResults;
    let templateAstResults = this._parsedTemplateResults;
    let issues = [];

    templateAstResults.methods.forEach(method => {
      if (jsAstResults.methods.indexOf(method.name) === -1) {
        issues.push({
          line: method.pos[0],
          column: method.pos[1],
          token: method.name,
          msg: `method: "${method.name}" is not defined.`
        });
      }
    });

    templateAstResults.vars.forEach((varItem) => {
      if (jsAstResults.vars.indexOf(varItem.name) === -1) {
        issues.push({
          line: varItem.pos[0],
          column: varItem.pos[1],
          token: varItem.name,
          msg: `variable: "${varItem.name}" is not defined.`
        });
      }
    });

    return issues;
  }

  check() {
    return [...this.checkCustomizedComponents(), ...this.checkTemplateAndScript()];
  }
}

module.exports = TemplateChecker;
