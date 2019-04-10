
const CMLNode = require('./cmlNode.js');
const path = require('path');
class mvvmGraphPlugin {
  apply(compiler) {
    compiler.plugin('should-emit', function(compilation) {
      debugger
      let modules = compilation.modules;
      let appModules = [];
      for (let i = 0; i < modules.length; i++) {
        if (modules[i]._fileType === 'app') {
          appModules.push(appModules);
        }
      }
      console.log(appModules)
    })
  }
}

module.exports = mvvmGraphPlugin;