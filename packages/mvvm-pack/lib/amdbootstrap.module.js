
/**
 * 模块型
 */
(function() {

  var factoryMap = {};

  var modulesMap = {};
  var cmldefine = function(id, factory) {
    if (!factoryMap[id]) {
      factoryMap[id] = factory;
    }
  };

  var cmlrequire = function(id) {
    var mod = modulesMap[id];
    if (mod) {
      return mod.exports;
    }

    var factory = factoryMap[id];
    if (!factory) {
      throw new Error('[ModJS] Cannot find module "' + id + '"');
    }

    mod = modulesMap[id] = {
      exports: {}
    };

    var ret = (typeof factory == 'function')
      ? factory.apply(mod, [cmlrequire, mod.exports, mod])
      : factory;
    if (ret) {
      mod.exports = ret;
    }
    return mod.exports;
  };

  module.exports = {
    cmldefine: cmldefine,
    cmlrequire: cmlrequire
  }
})();


