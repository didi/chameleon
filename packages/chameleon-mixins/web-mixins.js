
const common = require('./common.js');
const webStyleHandle = require('chameleon-css-loader/proxy/proxyWeb.js');
const {px2cpx} = require('./px2cpx.js');
const _ =  module.exports  = {};
common.merge(_, common);


_.mixins = {
  methods: {
    //支持事件传参
    [_.inlineStatementEventProxy](...args){
      let _cml_event_lmc; // ...args 的参数是用户传入的，可能为任意值，防止冲突；(a,'item',e);
      args = args.reduce((result,arg) => {
        if(arg instanceof Event){
          _cml_event_lmc = arg;
          result.push(getNewEvent(arg))
        }else{
          result.push(arg)
        }
        return result;
      },[]);
      let originFuncName = args[0];
      let isStopBubble = args[1];
      if(isStopBubble && _cml_event_lmc && typeof _cml_event_lmc.stopPropagation === 'function'){
        _cml_event_lmc.stopPropagation();
      }
      if(this[originFuncName] && _.isType(this[originFuncName], 'Function')){
        this[originFuncName](...args.slice(2))
      }else{
        console.log(`can not find function ${originFuncName}`)
      }
    },
    //代理 事件，可以使用v-model
    [_.modelEventProxyName](e,modelKey){
      let newEvent = getNewEvent(e);
      this[modelKey] = newEvent.detail.value;

    },
    [_.eventProxyName](e, originFuncName,isStopBubble) {
      //调用原始事件
      if(isStopBubble && typeof e.stopPropagation === 'function'){
        e.stopPropagation();
      }
      if(this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
        //获取新的事件对象
        let newEvent = getNewEvent(e);
        this[originFuncName](newEvent)
      } else {
        console.log(`can not find function  ${originFuncName}`)
      }

    },
    [_.eventEmitName](eventKey, detail){
      //传递的参数内容包装成detail参数
      this.$emit(eventKey, {
        type: eventKey,
        detail,
        stopPropagation:function(){}
      })
      if(this['$__checkCmlEmit__']) {
        this['$__checkCmlEmit__'](eventKey, detail);
      }
    },
    [_.styleParseName](content) {
      //web端不需要处理直接返回
      let res = '';
      if(_.isType(content, 'String')) {
        res = content

      } else if(_.isType(content, 'Object')) {
        Object.keys(content).forEach(key=>{
          res +=`${key}:${content[key]};`
        })
      }
      return res;
    },
    [_.styleProxyName](content,options) {
      return webStyleHandle(content,options);
    },
    [_.mergeStyleName](...args) {
      return _.mergeStyle(...args);
    }
  }
}

function getNewEvent(e) {
  let newEvent = {}
  let {type, timeStamp, target, currentTarget, touches, changedTouches, detail = {} } = e;

  newEvent._originEvent = e;

  if(type) {
    type = type.replace(/^weex\$/, '');
    type = type === 'click' ? 'tap' : type;
    newEvent.type = type;
  }

  if(timeStamp) {
    newEvent.timeStamp = parseInt(timeStamp);
  }

  if(target) {
    newEvent.target = {
      id: target.id,
      // offsetLeft: target.offsetLeft,
      // offsetTop: target.offsetTop,
      dataset: target.dataset
    }
  }

  if(currentTarget) {
    newEvent.currentTarget = {
      id: currentTarget.id,
      // offsetLeft: currentTarget.offsetLeft,
      // offsetTop: currentTarget.offsetTop,
      dataset: currentTarget.dataset
    }
  }

  if(touches) {
    newEvent.touches = [];
    for(let i=0;i<touches.length;i++) {
      let touch = touches[i];
      let ret = {}
      ret.identifier = touch.identifier;
      ret.pageX = px2cpx(parseInt(touch.pageX,10));
      ret.pageY = px2cpx(parseInt(touch.pageY,10));
      ret.clientX = px2cpx(parseInt(touch.clientX,10));
      ret.clientY = px2cpx(parseInt(touch.clientY,10));
      newEvent.touches.push(ret);
    }
  }

  if(changedTouches) {
    newEvent.changedTouches = [];
    for(let i=0;i<changedTouches.length;i++) {
      let touch = changedTouches[i];
      let ret = {}
      ret.identifier = touch.identifier;
      ret.pageX = px2cpx(parseInt(touch.pageX,10));
      ret.pageY = px2cpx(parseInt(touch.pageY,10));
      ret.clientX = px2cpx(parseInt(touch.clientX,10));
      ret.clientY = px2cpx(parseInt(touch.clientY,10));
      newEvent.changedTouches.push(ret);
    }
  }

  if(_.isType(detail, 'Object')) {
    newEvent.detail = detail
  } else {
    newEvent.detail = {}
  }

  if(target) {
    newEvent.detail.value = target.value;
  }

  //特殊事件处理
  if(type === 'loadmore') {
    newEvent.detail.direction = 'bottom';
  }

  if(type === 'scroll') {
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
