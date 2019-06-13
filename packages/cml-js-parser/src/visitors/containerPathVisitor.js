function getObjectKeyName(node) {
  return node.key.name;
}

function isValidProp(node) {
  const validKeys = ['props', 'data', 'computed', 'methods'];
  let keyName = getObjectKeyName(node);
  let idx = validKeys.indexOf(keyName);
  return ~idx ? validKeys[idx] : '';
}

function adoptPropResults(res, container) {
  res.forEach((prop) => {
    // fillKey is one of 'vars', 'methods', 'props' or 'events'
    container[prop.fillKey].push(prop.value);
  });
}

const propFuns = {
  props: function(path) {
    let props = [];
    path.get('value').get('properties')
      .forEach((prop) => {
        if (prop.isObjectProperty()) {
          let propName = getObjectKeyName(prop.node);
          props.push({
            fillKey: 'vars',
            value: propName
          });
          if (prop.get('value').isObjectExpression()) {
            let valueInfo = {};
            prop.get('value').get('properties')
              .forEach((childProp) => {
                let childName = getObjectKeyName(childProp.node);
                if (childName === 'type') {
                  valueInfo[childName] = childProp.get('value').isIdentifier() ? childProp.node.value.name : '';
                }
                if (childName === 'default') {
                  if (childProp.isObjectProperty()) {
                    valueInfo[childName] = ~childProp.node.value.type.indexOf('Literal') ? (childProp.node.value.value || '') : '';
                  } else {
                    valueInfo[childName] = '';
                  }
                }
                if (childName === 'required') {
                  valueInfo[childName] = childProp.get('value').isBooleanLiteral() ? childProp.node.value.value : false;
                }
              });
            props.push({
              fillKey: 'props',
              value: {
                name: propName,
                valueType: valueInfo.type || '',
                required: !!valueInfo.required || false,
                default: valueInfo['default']
              }
            });
          }
          if (prop.get('value').isIdentifier()) {
            props.push({
              fillKey: 'props',
              value: {
                name: propName,
                valueType: prop.node.value.name,
                required: false,
                default: ''
              }
            });
          }
        }
      });
    return props;
  },
  data: function(path) {
    let props = [];
    path.get('value').get('properties')
      .forEach((prop) => {
        if (prop.isObjectProperty()) {
          props.push({
            fillKey: 'vars',
            value: getObjectKeyName(prop.node)
          });
        }
      });
    return props;
  },
  computed: function(path) {
    let props = [];
    path.get('value').get('properties')
      .forEach((prop) => {
        if (prop.isObjectMethod()) {
          props.push({
            fillKey: 'vars',
            value: getObjectKeyName(prop.node)
          });
        }
        if (prop.isObjectProperty() && prop.get('value').isFunctionExpression()) {
          props.push({
            fillKey: 'vars',
            value: getObjectKeyName(prop.node)
          });
        }
        if (prop.isSpreadElement()) {
          prop.get('argument').isCallExpression() && prop.get('argument').get('arguments')
            .forEach((argItem) => {
              argItem.isObjectExpression() && argItem.get('properties').forEach((argProp) => {
                props.push({
                  fillKey: 'vars',
                  value: getObjectKeyName(argProp.node)
                });
              });
            });
        }
      });
    return props;
  },
  methods: function(path) {
    let props = [];
    path.get('value').get('properties')
      .forEach((prop) => {
        if (prop.isObjectMethod()) {
          props.push({
            fillKey: 'methods',
            value: getObjectKeyName(prop.node)
          });
        }
        if (prop.isObjectProperty() && prop.get('value').isFunctionExpression()) {
          props.push({
            fillKey: 'methods',
            value: getObjectKeyName(prop.node)
          });
        }
      });
    return props;
  }
};

module.exports.containerPathVisitor = function(path) {
  let results = {vars: [], methods: [], props: [], events: []};

  path && path.traverse({
    'ClassProperty|ObjectProperty'(path) {
      let propName = isValidProp(path.node);
      if (propName && path.get('value').isObjectExpression()) {
        adoptPropResults(propFuns[propName](path), results);
      }
    },
    MemberExpression(path) {
      if (!path.node.computed && path.get('object').isThisExpression() && path.get('property').isIdentifier()) {
        if (path.node.property.name === '$cmlEmit') {
          let parentNode = path.findParent(path => path.isCallExpression());
          if (parentNode && parentNode.get('arguments')) {
            let nameArg = parentNode.get('arguments')[0];
            if (nameArg.isStringLiteral()) {
              results.events.push({
                name: parentNode.get('arguments')[0].node.value,
                paramsNum: -1,
                params: []
              });
            } else if (nameArg.isIdentifier()) {
              let argBinding = nameArg.scope.getBinding(nameArg.node.name);
              let possibleInit = argBinding ? argBinding.path.node.init : null;
              // For now, we only check just one jump along its scope chain.
              if (possibleInit && possibleInit.type === 'StringLiteral') {
                results.events.push({
                  name: possibleInit.value,
                  paramsNum: -1,
                  params: []
                });
              }
            }
          }
        }
      }
    }
  });

  return results;
}
