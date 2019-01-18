const genericTypes = ['string', 'number', 'object', 'boolean', 'void', 'null'];
const genericAnnotationTypes = ['ObjectTypeAnnotation'];
const composedAnnotationTypes = ['TupleTypeAnnotation', 'UnionTypeAnnotation', 'IntersectionTypeAnnotation'];

function getTypeAliasInfo(bodyItem = {}) {
  let aliasInfo = {};
  aliasInfo.typeName = bodyItem.id.name;
  aliasInfo.flowType = bodyItem.right.type;

  if (~genericAnnotationTypes.indexOf(bodyItem.right.type) && bodyItem.right && bodyItem.right.properties) {
    aliasInfo.props = bodyItem.right.properties.map((prop) => {
      return {
        name: prop.key.name,
        valueType: prop.value.id.name
      };
    });
  } else if (~composedAnnotationTypes.indexOf(bodyItem.right.type)) {
    aliasInfo.props = bodyItem.right.types.map((typeItem) => {
      return {
        name: typeItem.id.name, valueType: typeItem.id.name
      };
    });
  } else {
    aliasInfo.props = [];
  }
  return aliasInfo;
}


function getTypeAliasChain(typeDefinations, propItem) {
  let _savedTypeChain = [];
  travelTypes(typeDefinations, propItem);
  return _savedTypeChain;
  function travelTypes(typeDefinations, propItem) {
    if (typeDefinations && propItem) {
      propItem.props.forEach((prop) => {
        let nextProp = typeDefinations[prop.valueType];
        nextProp && _savedTypeChain.push(nextProp) && travelTypes(typeDefinations, nextProp);
      });
    }
  }
}


function parse(astTree) {
  let typeDefinations = {}; let results = {vars: [], methods: [], props: [], events: []};

  astTree && astTree.type === 'File' && astTree.program.body.filter((bodyItem) => {
    return ['TypeAlias', 'InterfaceDeclaration'].indexOf(bodyItem.type) > -1;
  }).forEach((bodyItem) => {
    if (bodyItem.type === 'TypeAlias') {
      bodyItem._typeAliasInfo = getTypeAliasInfo(bodyItem);
      bodyItem._typeAliasInfo.typeName && (typeDefinations[bodyItem._typeAliasInfo.typeName] = bodyItem._typeAliasInfo);
      delete bodyItem._typeAliasInfo;
    }
    (bodyItem.type === 'InterfaceDeclaration') && bodyItem.body.properties.forEach((propertyItem) => {
      if (propertyItem.method) {
        results.methods.push(propertyItem.key.name);
        results.events.push({
          name: propertyItem.key.name,
          paramsNum: propertyItem.value.params.length,
          params: propertyItem.value.params ? propertyItem.value.params.filter((param) => {
            return param.typeAnnotation.type === 'GenericTypeAnnotation';
          }).map((param) => {
            let typeParam = typeDefinations[param.typeAnnotation.id.name] || {typeName: param.typeAnnotation.id.name};
            typeParam.varName = param.name.name;
            if (typeParam.props) {typeParam.typeChain = getTypeAliasChain(typeDefinations, typeParam);}
            return typeParam;
          }) : []
        });
      } else {
        results.vars.push(propertyItem.key.name);
        propertyItem._formattedPropertyItem = {
          name: propertyItem.key.name,
          valueType: propertyItem.value.id.name,
          props: (genericTypes.indexOf(propertyItem.value.id.name.toLowerCase()) === -1) ? [{
            name: propertyItem.value.id.name, valueType: propertyItem.value.id.name
          }] : []
        };
        propertyItem._formattedPropertyItem.typeChain = getTypeAliasChain(typeDefinations, propertyItem._formattedPropertyItem);
        results.props.push(propertyItem._formattedPropertyItem);
        delete propertyItem._formattedPropertyItem;
      }
    });
  });

  return results;
}

module.exports = {
  parse
};
