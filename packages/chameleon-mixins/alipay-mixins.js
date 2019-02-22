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
    console.log('alipay-props', this.props, detail)
    let eventKeyProps = this.props["data-event" + eventKey];
    let alipayDetail = detail ;
    if (Object.prototype.toString.call(detail) === '[object Object]' && this.props['data-modelkey']) {
      let aliModelKey = this.props['data-modelkey'] || '';
      alipayDetail = Object.assign(detail, {aliModelKey})
    }
    eventKeyProps && this.props[_.cmlPropsEventProxy.key](eventKeyProps, alipayDetail);
    if (this.$__checkCmlEmit__) {
      this.$__checkCmlEmit__(eventKey, detail);
    }
  },
  [_.cmlPropsEventProxy.value](eventName, value) {
    this[eventName] && this[eventName]({
      detail: value
    });
  }
});
