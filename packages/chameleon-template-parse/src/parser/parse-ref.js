// import * as t from "@babel/types";
const t = require('@babel/types');
const { SyncHook } = require("tapable");

let parseRef = new SyncHook(['args'])
parseRef.tap('wx', (args) => {
  let { path, type } = args;
  if (type === 'wx' || type === 'alipay' || type === 'baidu') {
    let parentPath = path.parentPath;
    let attributes = parentPath.node.attributes;
    let idNode = attributes.find((attr) => attr.name.name === 'id');
    let refNode = attributes.find((attr) => attr.name.name === 'ref');
    let classNode = attributes.find((attr) => attr.name.name === 'class');
    if (idNode) {
      idNode.value.value = refNode.value.value;
    } else {
      attributes.push(t.jsxAttribute(t.jsxIdentifier('id'), t.stringLiteral(refNode.value.value)))
    }
    if (!classNode) { // 不存在class节点
      attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), t.stringLiteral('_cml_ref_lmc_')))
    } else {
      classNode.value.value = `${classNode.value.value}  _cml_ref_lmc_`
    }


    path.remove();
  }

})


module.exports.parseRef = parseRef;
