
/**
 * 处理chameleon-cli构建项目中的module id
 * @param {*} compiler
 */

const createHash = require("crypto").createHash;
const {chameleonHandle} = require('./utils.js');


module.exports = function(compiler, options) {

  if (compiler.hooks) {
    compiler.hooks.compilation.tap("chameleon-plugin", (compilation) => {
      const usedIds = new Set();
      compilation.hooks.beforeModuleIds.tap("chameleon-plugin", (modules) => {
        modules.forEach((module) => {
          moduleIdHandle.call(this, module, usedIds)
        });
      });
    });

  } else {

    compiler.plugin("compilation", (compilation) => {
      const usedIds = new Set();
      compilation.plugin("before-module-ids", (modules) => {
        modules.forEach((module) => {
          moduleIdHandle.call(this, module, usedIds)
        });
      });
    });
  }


  function moduleIdHandle(module, usedIds) {
    if (module.id === null && module.libIdent) {
      let id = module.libIdent({
        context: this.options.context || compiler.options.context
      });

      id = chameleonHandle(id, this.options.cliName);

      const hash = createHash(this.options.hashFunction);
      hash.update(id);
      const hashId = hash.digest(this.options.hashDigest);
      let len = this.options.hashDigestLength;
      while (usedIds.has(hashId.substr(0, len))) {len++;}
      module.id = hashId.substr(0, len);
      usedIds.add(module.id);
    }
  }


}
