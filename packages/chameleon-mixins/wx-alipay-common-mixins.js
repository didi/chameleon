

const common = require('./common.js');
const wxStyleHandle = require('chameleon-css-loader/proxy/proxyMiniapp.js')

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
      let originFuncName = dataset && dataset[`event${e.type}`];

      let argsStr = dataset && dataset.args;
      let argsArr = argsStr.split(',').reduce((result, item, index) => {
        let arg = dataset[`arg${index}`];
        if (arg === "$event") {
          let newEvent = getNewEvent(e);
          result.push(newEvent);
        } else {
          // 这里的值微信已经计算好了；到dateset的时候已经是计算的结果 比如msg = 'sss' data-arg1="{{msg + 1}}"
          // dataset[arg1] = 'sss1'
          result.push(dataset[`arg${index}`])
        }
        return result;

      }, []);
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
      let originFuncName = dataset && dataset[`event${e.type}`]
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
      } else {
        newEvent[key] = e[key]
      }
    }
  })

  newEvent._originEvent = e;
  return newEvent;
}
