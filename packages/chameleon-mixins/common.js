
const _ = module.exports = {};
const utils = require('./utils.js')
_.eventProxyName = '_cmlEventProxy';
_.modelEventProxyName = '_cmlModelEventProxy';// c-model  v-model的事件代理
_.inlineStatementEventProxy = '_cmlInlineStatementEventProxy';// 内联语句的事件代理
_.eventEmitName = '$cmlEmit'; // 触发事件的方法
_.styleParseName = '$cmlStyle'; // 提供各端处理style属性的方法  weex中处理成对象，wx中处理成字符串，web中不处理
_.styleProxyName = '_cmlStyleProxy'; // 提供代理 weex和web端处理style
_.mergeStyleName = '$cmlMergeStyle';
_.animationProxy = '_animationCb';
_.weexClassProxy = '_weexClassProxy';
_.merge = function(target, fromObj) {
  Object.keys(fromObj).forEach(key => {
    target[key] = fromObj[key]
  })
}


_.isType = function (obj, type) {
  return Object.prototype.toString.call(obj).slice(8, -1) === type
}


_.mergeStyle = function (...args) {
  // 可以接受字符串或者对象
  function styleToObj(str) {
    let obj = {};
    str.split(';').filter(item => !!item.trim())
      .forEach(item => {
        let {key, value} = utils.getStyleKeyValue(item);
        key = key.replace(/\s+/, '')
        value = value.replace(/\s+/, '')
        obj[key] = value
      })
    return obj;
  }
  let arr = [];
  args.forEach(arg => {
    if (typeof arg === 'string') {
      arr.push(styleToObj(arg))
    } else if (Object.prototype.toString.call(arg) === '[object Object]') {
      arr.push(arg);
    }
  })
  let resultObj = Object.assign(...arr)

  let resultStr = ''
  Object.keys(resultObj).forEach(key => {
    resultStr += `${key}:${resultObj[key]};`
  })
  return resultStr;

}
_.trim = function (value) {
  return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};
_.isReactive = function(value) {
  let reg = /(?:^'([^']*?)'$)/;
  return _.trim(value).match(reg);
}
