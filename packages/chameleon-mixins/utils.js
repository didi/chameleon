const _ = module.exports = {};

_.getStyleKeyValue = function(declaration) {
  let colonIndex = declaration.indexOf(':');
  let key = declaration.slice(0, colonIndex);
  let value = declaration.slice(colonIndex + 1);
  return {
    key, value
  }
}
// 支付宝中的e.type="touchStart"
_.handleEventType = function(eventType) {
  let aliEventMap = {
    touchStart: "touchstart",
    touchEnd: "touchend",
    touchMove: "touchmove"
  }
  if (Object.keys(aliEventMap).includes(eventType)) {
    return aliEventMap[eventType]
  } else {
    return eventType
  }
}
// 对于组件上绑定的touchstart事件，在编译之后会处理成 onTouchStart="handleStart",所以需要改为对应的大写
_.handleCompEventType = function(eventType) {
  let aliEventMap = {
    touchstart: 'touchStart',
    touchend: 'touchEnd',
    touchmove: 'touchMove'
  }
  if (Object.keys(aliEventMap).includes(eventType)) {
    return aliEventMap[eventType]
  } else {
    return eventType
  }
}

