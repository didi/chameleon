const t = require('@babel/types')

const { SyncHook } = require('tapable');
const {
  interationMap
} = require('../common/cml-map.js');
const utils = require('../common/utils');

let parseInteration = new SyncHook(['args'])

parseInteration.tap('web-weex', (args) => {
  let { path, node, type, options: {lang} } = args;

  if (lang === 'cml' && (type === 'web' || type === 'weex')) {
    let container = path.container;
    let forBody = utils.trimCurly(node.value.value);
    let forIdx = 'index';
    let forItem = 'item';
    let forKey = '';
    let siblingPaths = utils.getSiblingPaths(path);
    for (let item of container) {
      if (item.name.name === 'c-for-index') {
        forIdx = (item.value && item.value.value) || 'index';
      }
      if (item.name.name === 'c-for-item') {
        forItem = (item.value && item.value.value) || 'item';
      }
      if (item.name.name === 'c-key') {
        // 这个 for-key的限制是来自于微信端；
        forKey = item.value && item.value.value;
        if (forKey && forKey === '*this') {
          forKey = forIdx;
        } else {
          forKey = forItem + '.' + forKey;
        }
      }
    }
    node.name.name = 'v-for';
    node.value.value = `(${forItem}, ${forIdx}) in ${forBody}`;
    // 移除 c-for-index c-for-item c-key这些jsxAttribute
    siblingPaths.forEach((siblingPath) => {
      if (siblingPath.node.name.name === 'c-for-index' ||
        siblingPath.node.name.name === 'c-for-item' ||
        siblingPath.node.name.name === 'c-key'
      ) {
        // 如果相邻元素有c-key才会插入一个 :key的JSXAttributer;
        if (siblingPath.node.name.name === 'c-key') {
          path.insertAfter(t.jsxAttribute(t.jsxIdentifier(':key'), t.stringLiteral(forKey)));
        }
        siblingPath.remove();
      }
    })
  }
})
parseInteration.tap('wx-alipay-qq-tt', (args) => {
  let { path, node, type, options: {lang} } = args;
  let miniAppType = ['wx', 'alipay', 'qq', 'tt'];
  if (lang === 'cml' && miniAppType.includes(type)) {
    let name = node.name.name;
    node.name.name = interationMap[name][type];
    let siblingPaths = utils.getSiblingPaths(path);
    siblingPaths.forEach((siblingPath) => {
      let siblingPathName = siblingPath.node.name.name;
      if (siblingPathName === 'c-for-index') {
        siblingPath.node.name.name = interationMap[siblingPathName][type];
      }
      if (siblingPathName === 'c-for-item') {
        siblingPath.node.name.name = interationMap[siblingPathName][type];
      }
      if (siblingPathName === 'c-key') {
        siblingPath.node.name.name = interationMap[siblingPathName][type];
      }
    })
  }
});
parseInteration.tap('baidu', (args) => {
  let { path, node, type, options: {lang} } = args;
  if (lang === 'cml' && type === 'baidu') {
    let name = node.name.name;
    node.name.name = interationMap[name][type];
    node.value.value = utils.trimCurly(node.value.value);
    let siblingPaths = utils.getSiblingPaths(path);
    siblingPaths.forEach((siblingPath) => {
      let siblingPathName = siblingPath.node.name.name;
      if (siblingPathName === 'c-for-index') {
        siblingPath.node.name.name = interationMap[siblingPathName][type];
        siblingPath.node.value.value = utils.trimCurly(siblingPath.node.value.value)
      }
      if (siblingPathName === 'c-for-item') {
        siblingPath.node.name.name = interationMap[siblingPathName][type];
        siblingPath.node.value.value = utils.trimCurly(siblingPath.node.value.value)
      }
      if (siblingPathName === 'c-key') {
        siblingPath.node.name.name = interationMap[siblingPathName][type];
        siblingPath.node.value.value = utils.trimCurly(siblingPath.node.value.value)
      }
    })
  }
})
module.exports.parseInteration = parseInteration;
