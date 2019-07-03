

const common = require('./common.js');
const wxStyleHandle = require('chameleon-css-loader/proxy/proxyMiniapp.js')
const utils = require('./utils.js');
const {px2cpx} = require('./miniapp-px2cpx.js');
const deepClone = function(obj) {
  if (obj.toString().slice(8, -1) !== "Object") {
    return obj;
  }
  let res = {};
  Object.keys(obj).forEach(key => {
    res[key] = deepClone(obj[key]);
  })
  return res;
}

var _ = module.exports = { deepClone };

common.merge(_, common);

_.mixins = {
  methods: {
    // 支持事件传参
    [_.inlineStatementEventProxy](e) {
      let { dataset } = e.currentTarget;
      // 支付宝的e.type = 'touchStart',需要改为小写，否则找不到函数
      e.type = utils.handleEventType(e.type);
      let eventKey = e.type.toLowerCase();
      let originFuncName = dataset && dataset[`event${eventKey}`] && dataset[`event${eventKey}`][0];
      let inlineArgs = dataset && dataset[`event${eventKey}`] && dataset[`event${eventKey}`].slice(1);
      let argsArr = [];
      // 由于百度对于 data-arg="" 在dataset.arg = true 值和微信端不一样所以需要重新处理下这部分逻辑
      if (inlineArgs) {
        argsArr = inlineArgs.reduce((result, arg, index) => {
          if (arg === "$event") {
            let newEvent = getNewEvent(e);
            result.push(newEvent);
          } else {
            result.push(arg)
          }
          return result;
        }, []);
      }
      if (originFuncName && this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
        this[originFuncName](...argsArr)
      } else {
        console.log(`can not find method ${originFuncName}`)
      }
    },
    [_.modelEventProxyName](e) {
      let dataset = e.currentTarget && e.currentTarget.dataset
      let modelKey = dataset && dataset.modelkey
      if (modelKey) {
        this[modelKey] = e.detail.value;
      }

    },
    [_.eventProxyName](e) {
      let { dataset } = e.currentTarget;
      // 支付宝的e.type = 'touchStart',需要改为小写，否则找不到函数
      e.type = utils.handleEventType(e.type);
      let eventKey = e.type.toLowerCase();
      let originFuncName = dataset && dataset[`event${eventKey}`] && dataset[`event${eventKey}`][0];
      if (originFuncName && this[originFuncName] && _.isType(this[originFuncName], 'Function')) {
        let newEvent = getNewEvent(e);
        this[originFuncName](newEvent)

      } else {
        console.log(`can not find method ${originFuncName}`)
      }
    },
    [_.styleParseName](content) {
      let res = ''
      if (_.isType(content, 'Object')) {
        Object.keys(content).forEach(key => {
          res += `${key}:${content[key]};`
        })
      } else if (_.isType(content, 'String')) {
        res = content;
      }
      return wxStyleHandle(res);
    },
    [_.mergeStyleName](...args) {
      return _.mergeStyle(...args);
    },
    [_.animationProxy](...args) {
      let animationValue = args[0];
      // animationValue:{cbs:{0:cb0,1:cb1,length:2},index}
      let animation = this[animationValue];// 引用值
      if (!animation) {
        return ;
      }
      const { cbs, index } = animation;
      // 配合 解决百度端动画bug
      if (cbs === undefined || index === undefined) {return ;}
      let cb = cbs[index];
      if (cb && typeof cb === 'function') {
        cb();
      }
      delete animation.index;
      animation.index = index + 1;
    }
  }

}

function getNewEvent(e) {
  let newEvent = {};
  ['type', 'timeStamp', 'target', 'currentTarget', 'detail', 'touches', 'changedTouches'].forEach((key) => {
    if (e[key]) {
      if (~['target', 'currentTarget'].indexOf(key)) {
        let newTarget = {}
        newTarget = {
          id: e[key].id,
          dataset: e[key].dataset
        }
        newEvent[key] = newTarget
      } else if (~['touches', 'changedTouches'].indexOf(key)) {
        if (key == 'touches') {
          let touches = e[key];
          newEvent.touches = [];
          for (let i = 0;i < touches.length;i++) {
            let touch = touches[i];
            let ret = {}
            ret.identifier = touch.identifier;
            ret.pageX = px2cpx(parseInt(touch.pageX, 10));
            ret.pageY = px2cpx(parseInt(touch.pageY, 10));
            ret.clientX = px2cpx(parseInt(touch.clientX, 10));
            ret.clientY = px2cpx(parseInt(touch.clientY, 10));
            newEvent.touches.push(ret);
          }
        }

        if (key == 'changedTouches') {
          let changedTouches = e[key]
          newEvent.changedTouches = [];
          for (let i = 0;i < changedTouches.length;i++) {
            let touch = changedTouches[i];
            let ret = {}
            ret.identifier = touch.identifier;
            ret.pageX = px2cpx(parseInt(touch.pageX, 10));
            ret.pageY = px2cpx(parseInt(touch.pageY, 10));
            ret.clientX = px2cpx(parseInt(touch.clientX, 10));
            ret.clientY = px2cpx(parseInt(touch.clientY, 10));
            newEvent.changedTouches.push(ret);
          }
        }
      } else {
        newEvent[key] = e[key]
      }
    }
  })

  newEvent._originEvent = e;
  return newEvent;
}
