
const path = require('path');
const MvvmCompiler = require('./compiler.js');

class mvvmGraphPlugin {
  constructor(options = {}) {
    this.options = options;
    
  }
  apply(compiler) {
    let npmName = cml.config.get().extPlatform[this.options.cmlType];
    let PlatformPlugin = require(path.join(cml.projectRoot, 'node_modules', npmName)); // eslint-disable-line
    let plugin = new PlatformPlugin(this.options);
    let mvvmCompiler = new MvvmCompiler(compiler);
    plugin.register(mvvmCompiler);
    
    compiler.plugin('should-emit', function(compilation) {
      mvvmCompiler.run(compilation.modules);
      // 返回false 不进入emit阶段
      return false;      
    })
    
  }
}

module.exports = mvvmGraphPlugin;