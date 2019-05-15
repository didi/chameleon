
/**
 * 全局型
 */

(function(cmlglobal) {
  cmlglobal = cmlglobal || {};
  cmlglobal.cmlrequire;

  var factoryMap = {};

  var modulesMap = {};
  cmlglobal.cmldefine = function(id, factory) {
    factoryMap[id] = factory;
  };

  cmlglobal.cmlrequire = function(id) {
    var mod = modulesMap[id];
    if (mod) {
      return mod.exports;
    }

    var factory = factoryMap[id];
    if (!factory) {
      throw new Error('[ModJS] Cannot find module `' + id + '`');
    }

    mod = modulesMap[id] = {
      exports: {}
    };

    var ret = (typeof factory == 'function')
      ? factory.apply(mod, [require, mod.exports, mod])
      : factory;

    if (ret) {
      mod.exports = ret;
    }
    return mod.exports;
  };

})($GLOBAL); // 全局变量
