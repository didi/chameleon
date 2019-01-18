const SuspiciousNode = require('../classes/suspicious-node');
const CustomizedNode = require('../classes/customized-node');
const Tools = require('../tools');

let _usingComponents = [];
let _platform = 'cml';
let _lang = 'cml';

let _customizedComponents = [];
let _allSuspiciousNodes = [];


function _clean() {
  _customizedComponents = [];
  _allSuspiciousNodes = [];
}

function saveToCustomizedComponents(tag) {
  (_usingComponents.indexOf(tag.name) > -1) && _customizedComponents.push(new CustomizedNode(tag, Tools.isOriginComponent(tag) ? _platform : _lang));
}

function saveToTextNodes(node, scope) {
  if (Tools.isSuspiciousTextnode({lang: _lang, text: node.data})) {
    _allSuspiciousNodes.push(new SuspiciousNode({
      name: '',
      rawValue: node.data,
      valuePos: node.lineCol,
      lang: _lang,
      scope: scope,
      isTextNode: true
    }));
  }
}

function saveToPossibleAttrs(attrs) {
  _allSuspiciousNodes = _allSuspiciousNodes.concat(attrs.map(attr => {
    return new SuspiciousNode({
      name: attr.name,
      rawValue: attr.value,
      valuePos: attr.valueLineCol,
      lang: attr.lang,
      scope: attr.scope,
      isTextNode: false
    });
  }));
}

function _travel(tag) {
  if (tag.type === 'tag') {
    saveToCustomizedComponents(tag);

    !tag._cmlScopes && (tag._cmlScopes = []);
    if (Tools.hasForLoopDirective({tag, lang: _lang})) {
      tag._cmlScopes.push(Tools.getScopeFromTag({tag, lang: _lang}));
    }

    saveToPossibleAttrs(Object.keys(tag.attribs).map((item) => {
      // becasue attribute's valueLineCol is actually calculated based on rawValue, so we need readjusting the column.
      tag.attribs[item].rawValue && (tag.attribs[item].valueLineCol[1] = tag.attribs[item].valueLineCol[1] + tag.attribs[item].rawValue.indexOf(tag.attribs[item].value));
      return {
        name: item,
        lang: Tools.isOriginComponent(tag) ? _platform : _lang,
        scope: [...tag._cmlScopes],
        value: tag.attribs[item].value,
        valueLineCol: tag.attribs[item].valueLineCol
      };
    }));
  }


  if (tag.children && tag.children.length > 0) {
    tag.children.filter((item) => {
      if (item.type === 'text') {
        saveToTextNodes(item, [...tag._cmlScopes]);
      }
      return item.type === 'tag';
    }).forEach((childTag) => {
      childTag._cmlScopes = [...tag._cmlScopes];
      _travel(childTag);
    });
  }
}

function travel({root, lang = 'cml', platform = 'cml', usingComponents = []}) {

  _usingComponents = usingComponents; _platform = platform; _lang = lang;

  _clean();
  // make a deep copy of root ast, so we won't effect oiriginal structure during our process.
  _travel({...root});

  return {
    components: _customizedComponents,
    nodes: _allSuspiciousNodes
  };
}

module.exports = {
  travel
};
