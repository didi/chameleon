const commonMixins = require('./wx-alipay-common-mixins.js');

var _ = module.exports = commonMixins.deepClone(commonMixins);

commonMixins.merge(_.mixins.methods, {
  [_.eventEmitName]: function(eventKey, detail) {
    let eventKeyProps = this.props["data-event" + eventKey];
    function titleLize (word) {
      return word.replace(/^\w/, function (match) {
        return match.toUpperCase();
      })
    }
    this.props['on' + titleLize(eventKey)]({
      type: eventKey,
      detail,
      currentTarget: {
        dataset: {
          ['event' + eventKey]: eventKeyProps
        }
      }
    })
  }
});