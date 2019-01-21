const commonMixins = require('./wx-alipay-common-mixins.js');

var _ = module.exports = commonMixins.deepClone(commonMixins);
commonMixins.merge(_.mixins.methods, {
  [_.eventEmitName]: function(eventKey, detail) {
    this.triggerEvent(eventKey, detail);
    if (this.$__checkCmlEmit__) {
      this.$__checkCmlEmit__(eventKey, detail);
    }
  }
});
