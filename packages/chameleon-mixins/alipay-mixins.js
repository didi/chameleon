const commonMixins = require('./wx-alipay-common-mixins.js');

var _ = module.exports = commonMixins.deepClone(commonMixins);

commonMixins.merge(_.mixins.methods, {
  [_.eventEmitName]: function(eventKey, detail) {
    let modelkey = this.props['data-modelkey'];
    let eventKeyProps = this.props["data-event" + eventKey];
    function titleLize (word) {
      return word.replace(/^\w/, function (match) {
        return match.toUpperCase();
      })
    }
    let callback = this.props['on' + titleLize(eventKey)];
    if (callback && _.isType(callback, 'Function')) {
      callback({
        type: eventKey,
        detail,
        currentTarget: {
          dataset: {
            ['event' + eventKey]: eventKeyProps,
            modelkey
          }
        }
      })
    }

  }
});
