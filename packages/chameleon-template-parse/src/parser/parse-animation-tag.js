// import * as t from "@babel/types";
const { SyncHook } = require("tapable");
const utils = require('../common/utils');


let parseAnimationTag = new SyncHook(['args'])

parseAnimationTag.tap('wx', (args) => {
  let { node, type } = args;
  if (type === 'web' || type === 'weex') {
    node.name.name = 'v-animation';
    node.value.value = utils.trimCurly(node.value.value);
  }
  if (type === 'wx' || type === 'baidu' || type === 'alipay') {
    node.name.name = 'animation';
  }

})


module.exports.parseAnimationTag = parseAnimationTag;
