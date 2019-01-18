const { SyncHook } = require("tapable");
const utils = require('../common/utils');

let parseAttribute = new SyncHook(['args'])

parseAttribute.tap('web-weex', (args) => {
  let { node, type } = args;
  if (type === 'web' || type === 'weex') {
    let nodeName = node.name && node.name.name;
    let nodeValue = node.value && node.value.value;
    let vLength = nodeValue && nodeValue.length;
    const newValue = [];
    if (nodeValue && utils.isMustacheReactive(nodeValue)) {
      for (let idx = 0; idx < vLength; idx++) {
        if (nodeValue[idx] === '{' && idx < vLength - 1 && nodeValue[idx + 1] === '{') {
          newValue.push("'+(");
          idx++;
        } else if (nodeValue[idx] === '}' && idx < vLength - 1 && nodeValue[idx + 1] === '}') {
          newValue.push(")+'");
          idx++;
        } else {
          newValue.push(nodeValue[idx]);
        }
      }

      if (newValue.length != 0) {
        newValue.push("'");
        newValue.unshift("'");
        const nl = newValue.length;
        if (nl > 2 && newValue[nl - 1] === "'" && newValue[nl - 2] === ")+'") {
          newValue.splice(-2, 2);
          newValue.push(')');
        }
        if (newValue.length > 2 && newValue[0] === "'" && newValue[1] === "'+(") {
          newValue.splice(0, 2);
          newValue.unshift('(');
        }
        nodeValue = newValue.join('');
      }
      if (nodeName[0] === ':') {
        node.value.value = nodeValue;
      } else {
        node.name.name = `:${nodeName}`;
        node.value.value = nodeValue;
      }

    }
  }
});

exports.parseAttribute = parseAttribute;
