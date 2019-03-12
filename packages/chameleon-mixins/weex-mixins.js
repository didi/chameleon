
const common = require('./common.js');
const weexStyleHandle = require('chameleon-css-loader/transform/weex.js')
const utils = require('./utils.js');

const _ = module.exports = {};
common.merge(_, common);


_.mixins = {
  methods: {
    //支持事件传参
    [_.inlineStatementEventProxy](...args) {
      function _is__WEEX__EVENT(weexEvent) {
        let weexEventKeys = Object.keys(weexEvent);
        let weexEventFlagKeys = ['type', 'target', 'timestamp'];
        return weexEventFlagKeys.every((flagKey) => {
          return weexEventKeys.includes(flagKey);
        })
      }
      let _cml_event_lmc; // ...args 的参数是用户传入的，可能为任意值，防止冲突；(a,'item',e);
      args = args.reduce((result, arg) => {
        if (_is__WEEX__EVENT(arg)) {
          _cml_event_lmc = arg;
          result.push(getNewEvent(arg))
        } else {
          result.push(arg)
        }
        return result;
      }, []);
      let originFuncName = args[0];
      let isStopBubble = args[1];
      if(isStopBubble && _cml_event_lmc && typeof _cml_event_lmc.stopPropagation === 'function'){
        _cml_event_lmc.stopPropagation();
      }
      if (this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
        this[originFuncName](...args.slice(2))
      } else {
        console.log(`can not find function ${originFuncName}`)
      }
    },
    [_.modelEventProxyName](e, modelKey) {
      let newEvent = getNewEvent(e);
      this[modelKey] = newEvent.detail.value;
    },
    [_.eventProxyName](e, originFuncName,isStopBubble) {
      if(isStopBubble && typeof e.stopPropagation === 'function'){
        e.stopPropagation();
      }
      //调用原始事件
      if (this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
        //获取新的事件对象
        let newEvent = getNewEvent(e);
        this[originFuncName](newEvent)
      } else {
        console.log(`can not find function  ${originFuncName}`)
      }

    },
    [_.eventEmitName](eventKey, detail) {
      //传递的参数内容包装成detail参数
      this.$emit(eventKey, {
        type: eventKey,
        detail
      })
      if (this['$__checkCmlEmit__']) {
        this['$__checkCmlEmit__'](eventKey, detail);
      }
    },
    //weex端的处理放到自动包装的代理函数中
    [_.styleParseName](content) {
      return content;
    },
    //动态的style ，编译时会自动包装的代理函数
    [_.styleProxyName](content) {
      let res = '';
      if (_.isType(content, 'String')) {
        res = content

      } else if (_.isType(content, 'Object')) {
        Object.keys(content).forEach(key => {
          res += `${key}:${content[key]};`
        })
      }
      //先统一转成字符串，处理后再转成对象
      res = weexStyleHandle.parse(res)
      var obj = {};
      res.split(';').filter(styleitem => {
        return !!styleitem.trim();
      }).forEach(item => {
        let { key, value } = utils.getStyleKeyValue(item);
        key = key.replace(/\s/g, '')
        value = value.replace(/\s/g, '')
        obj[key] = value;
      })
      return obj;
    },
    [_.mergeStyleName](...args) {
      return _.mergeStyle(...args);
    },
    // 只提供weex端动态class的代理
    [_.weexClassProxy](value) {
      if ((typeof value === 'string')) {
        return value.split(' ').filter((item) => !!item.trim());
      } else if (Object.prototype.toString.call(value) === '[object Array]') {
        return value
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        return Object.keys(value).filter((key) => value[key])
      } else {
        throw new Error(`please check if the value of class is right at ${JSON.stringify(value)}`)
      }
    }

  }
}



function getNewEvent(e) {
  let newEvent = {}
  let { type, timestamp, target, currentTarget, touches, changedTouches, value, detail = {} } = e;

  newEvent._originEvent = e;

  if (type) {
    type = type.replace(/^weex\$/, '');
    type = type === 'click' ? 'tap' : type;
    newEvent.type = type;
  }

  if (timestamp) {
    newEvent.timeStamp = parseInt(e.timestamp);
  }

  if (target) {
    newEvent.target = getTarget(target)
  }

  if (currentTarget) {
    newEvent.currentTarget = getTarget(currentTarget)
  }

  function getTarget(originTarget) {
    let { attr } = originTarget;
    let id;
    let dataset = {};
    if (attr) {
      Object.keys(attr).forEach(key => {
        let originKey = key;
        if (key === 'id') {
          id = attr[key]
        } else {
          if (key.indexOf('data') === 0) {
            key = key.slice(4);
            //weex中会把data-name="yyl"  变成 dataName:yyl  data后的第一个字母大写
            key = key[0].toLowerCase() + key.slice(1);
            dataset[key] = attr[originKey]
          }
        }
      })
    }
    return {
      id,
      dataset
    }
  }

  if (touches) {
    newEvent.touches = [];
    for (let i = 0; i < touches.length; i++) {
      let touch = touches[i];
      let ret = {}
      ret.identifier = touch.identifier;
      ret.pageX = parseInt(touch.pageX);
      ret.pageY = parseInt(touch.pageY);
      ret.clientX = parseInt(touch.screenX);
      ret.clientY = parseInt(touch.screenY);
      newEvent.touches.push(ret);
    }
  }

  if (changedTouches) {
    newEvent.changedTouches = [];
    for (let i = 0; i < changedTouches.length; i++) {
      let touch = changedTouches[i];
      let ret = {}
      ret.identifier = touch.identifier;
      ret.pageX = parseInt(touch.pageX);
      ret.pageY = parseInt(touch.pageY);
      ret.clientX = parseInt(touch.screenX);
      ret.clientY = parseInt(touch.screenY);
      newEvent.changedTouches.push(ret);
    }
  }

  if (_.isType(detail, 'Object')) {
    newEvent.detail = detail
  } else {
    newEvent.detail = {}
  }


  if (value) {
    newEvent.detail.value = value;
  }

  //特殊事件处理
  if (type === 'loadmore') {
    newEvent.detail.direction = 'bottom';
  }

  if (type === 'scroll') {
    newEvent.detail = {
      ...newEvent.detail,
      scrollHeight: e.contentSize ? e.contentSize.height : 0,
      scrollWidth: e.contentSize ? e.contentSize.width : 0,
      scrollLeft: e.contentOffset ? Math.abs(e.contentOffset.x) : 0,
      scrollTop: e.contentOffset ? Math.abs(e.contentOffset.y) : 0, // 坐标轴变换
      deltaX: 0,
      deltaY: 0
    }
  }

  return newEvent;
}
