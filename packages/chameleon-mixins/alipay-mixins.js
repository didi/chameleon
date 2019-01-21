const commonMixins = require('./wx-alipay-common-mixins.js');

var _ = module.exports = commonMixins.deepClone(commonMixins);
commonMixins.merge(_, {
  cmlPropsEventProxy: {
    key: "onCmlPropsEventProxy",
    value: "_cmlPropsEventProxy"
  }
})
commonMixins.merge(_.mixins.methods, {
  [_.eventEmitName]: function(eventKey, detail) {
    let eventKeyProps = this.props["data-event" + eventKey];
    eventKeyProps && this.props[_.cmlPropsEventProxy.key](eventKeyProps, detail);
    if (this.$__checkCmlEmit__) {
      this.$__checkCmlEmit__(eventKey, detail);
    }
  },
  [_.cmlPropsEventProxy.value](eventName, value){
    this[eventName] && this[eventName]({
      detail: value
    });
  }
});