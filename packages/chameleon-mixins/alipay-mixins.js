const commonMixins = require('./wx-alipay-common-mixins.js');

var _ = module.exports = commonMixins.deepClone(commonMixins);
const utils = require('./utils.js');
commonMixins.merge(_.mixins.methods, {
  [_.eventEmitName]: function(eventKey, detail) {
    let dataset = {};
    let propKeys = Object.keys((this.props || {}));
    (propKeys || []).forEach((propKey) => {
      if (propKey.indexOf('data-') === 0) {
        let dataKey = propKey.slice(5);// 得到dataset中应该对应的key值
        if (dataKey) {
          dataset[dataKey] = this.props[propKey];

        }
      }
    })
    // let modelkey = this.props['data-modelkey'];
    // let eventKeyProps = this.props["data-event" + eventKey];
    function titleLize (word) { // 将开头字母转化为大写
      return word.replace(/^\w/, function (match) {
        return match.toUpperCase();
      })
    }
    // 这里对于用户自定义事件，会将首字母大写，但是对于原生事件 touchstart 仅仅大写是不够的，还需要将 touchstart ==> TouchStart
    eventKey = utils.handleCompEventType(eventKey);
    let callback = this.props['on' + titleLize(eventKey)];
    if (callback && _.isType(callback, 'Function')) {
      callback({
        type: eventKey,
        detail,
        currentTarget: {
          dataset
        }
      })
    }

  }
});
