const flowTypeSperetorMap = new Map([
  ['ObjectTypeAnnotation', ' , '],
  ['UnionTypeAnnotation', ' | '],
  ['IntersectionTypeAnnotation', ' & '],
  ['TupleTypeAnnotation', ' , ']
]);

function getDescWithTypeChain(typeChain = [], options = {offsetTabNum: 0}) {
  const tabStr = '&emsp;';
  return typeChain.map((typeItem) => {
    // using ES6 syntax to make a copy of typeItem object.
    let mapTypeItem = {...typeItem};
    if (mapTypeItem.flowType === 'ObjectTypeAnnotation') {
      mapTypeItem.props = typeItem.props.map((propItem) => [propItem.name, propItem.valueType].join(': '));
    } else {
      mapTypeItem.props = typeItem.props.map((propItem) => propItem.valueType);
    }
    return mapTypeItem;
  }).map((typeItem) => {
    let desc = typeItem.props.join(flowTypeSperetorMap.get(typeItem.flowType));
    if (typeItem.flowType === 'ObjectTypeAnnotation') {desc = ['{', desc, '}'].join('');}
    if (typeItem.flowType === 'TupleTypeAnnotation') {desc = ['[', desc, ']'].join('');}
    desc = tabStr.repeat(options.offsetTabNum) + `其中 ${typeItem.typeName} 的定义为 <br/>` + tabStr.repeat(options.offsetTabNum + 1) + desc;
    return desc;
  })
    .join('<br/>');
}


/**
 * Get a formatted readme file content.
 * @param {Object} param
 * {
 *  name: 'c-button', //generally, it's the file name,
 *  nameZh: '按钮', // The component's name in chinese
 *  props: [], // An array contains all the properties that this component file has.
 *  events: [] // An array contains all the events that this component may emit.
 * }
 */
function getReadmeFileContent(param = {}) {
  let fileContent = '';
  fileContent = `# ${param.name} \n`;
  fileContent = fileContent.concat('---\n\n');
  param.nameZh && (fileContent = fileContent.concat(`\n ${param.nameZh} \n`));
  fileContent += '|属性名|类型|说明|' + '\n| ------ | ------ | ------ |';
  param.props && param.props.forEach((prop) => {
    let notes = '';
    if (prop.typeChain) {notes = getDescWithTypeChain(prop.typeChain);}
    fileContent += `\n|${prop.name}|${prop.valueType}|${notes || ' '}|`;
  });
  param.events && param.events.forEach((event) => {
    let notes = '';
    event.params && event.params.forEach((paramItem, index) => {
      index != 0 && (notes += '<br/>');
      if (paramItem.props) {
        notes += `事件返回参数 ${paramItem.varName} [类型: ${paramItem.typeName}] <br/> `;
        notes += getDescWithTypeChain([paramItem]) + '<br/>';
        if (paramItem.typeChain) {notes += getDescWithTypeChain(paramItem.typeChain, {offsetTabNum: 1});}
      } else if (paramItem.typeName) {
        notes += `事件返回参数 ${paramItem.varName} [类型: ${paramItem.typeName}]`;
      }
    });

    if (event.paramNum === -1)
    {!notes && (notes = '待填写');}
    else
    {!notes && (notes = '事件未定义返回参数');}

    fileContent += `\n|c-bind:${event.name}|EventHandle|${notes}|`;
  });
  return fileContent;
}

module.exports = {
  getReadmeFileContent
}
