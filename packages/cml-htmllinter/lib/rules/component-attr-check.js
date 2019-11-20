var knife = require('../knife');
var Issue = require('../issue');
var proc = require('../process_option');

module.exports = {
  name: 'component-attr-check',
  on: ['tag'],
  options: [{
    name: 'component-event-regex',
    desc: 'If set, tag\'s attributes that match this regex will be considered as an evnet listener.',
    process: proc.regex
  }, {
    name: 'component-prop-regex',
    desc: 'If set, tag\'s attributes that match this regex will be recognized as a component\'s property.',
    process: proc.regex
  }, {
    name: 'component-allow-attr',
    desc: 'A configuration object that holds all the components\' information of properties and events. All tags that are list in this object will go through this ruler.',
    process: proc.object
  }]
};

function toCamelcase(str = '') {
  return (typeof str === 'string') ? str.split('-').map((seg, index) => {
    return index != 0 ? seg[0].toUpperCase() + seg.substring(1) : seg;
  })
    .join('') : '';
}

function toDash(str = '') {
  return (typeof str === 'string') ? str.replace(/([A-Z])/g, (match, caps) => {
    return '-' + caps.toLowerCase();
  }) : '';
}

function getRegExecRes(reg, str) {
  let res = str;
  if (reg && reg.exec(str)) {
    res = reg.exec(str)[1];
  }
  return res;
}

module.exports.lint = function (element, opts) {
  let components = opts['component-allow-attr'];
  let propRegex = opts['component-prop-regex'];
  let eventRegex = opts['component-event-regex'];
  let issueAttrs = [];
  let issues = [];

  if (components && components[element.name] && element.attribs) {

    let matchComponent = components[element.name];
    let propNames = matchComponent.props.map((prop) => prop.name);
    let requiredProps = matchComponent.props.filter((node) => node.required).map((node) => node.name);
    let events = matchComponent.events.map((method) => method.name);

    Object.entries(element.attribs).filter((attrib) => {     
      // verify events
      if (eventRegex && eventRegex.test(attrib[0])) {
        let eventName = eventRegex.exec(attrib[0])[1];
        if (knife.isCommonEvent(eventName)) {
          return false;
        }
        return !~events.indexOf(eventName);
      }      

      if (!eventRegex && events.indexOf(attrib[0]) > -1) {
        return false;
      }

      // verify normal attributes
      let attribProp = attrib[0];

      if (propRegex && propRegex.test(attribProp)) {
        attribProp = propRegex.exec(attribProp)[1];
      }

      if (knife.isCommonAttr(attribProp) || knife.isCmlDirective(attribProp)) {
        return false;
      }

      if (propNames.indexOf(toCamelcase(attribProp)) > -1) {
        return false;
      } 

      return true;
    })
    .forEach(attrib => {
      issueAttrs.push({
        ...attrib[1],
        _isEvent: eventRegex.test(attrib[0])
      });
    });

    if (requiredProps.length) {
      let attrKeys = Object.keys(element.attribs); 
      attrKeys = attrKeys.map(attr => {
        if (propRegex && propRegex.exec(attr))  {
          return propRegex.exec(attr)[1];
        } else {
          return attr;
        }
      });
      requiredProps.forEach((propName) => {
        if (!~attrKeys.indexOf(toDash(propName))) {
          issues.push(new Issue('E073', element.openLineCol, {
            element: element.name,
            prop: toDash(propName)
          }));
        }
      });
    }
  }

  issues = issues.concat(issueAttrs ? issueAttrs.map((issueAttr) => {
    let propName = issueAttr._isEvent ? (eventRegex ? getRegExecRes(eventRegex, issueAttr.name) : issueAttr.name) : (propRegex ? getRegExecRes(propRegex, issueAttr.name) : issueAttr.name);
    return new Issue(issueAttr._isEvent ? 'E064' : 'E063', issueAttr.nameLineCol.map((lineCol) => {
      lineCol[1] = issueAttr.name.indexOf(propName) + 1;
      return lineCol;
    }), {
      name: element.name,
      prop: propName
    })
  }) : []);

  return issues;
};
