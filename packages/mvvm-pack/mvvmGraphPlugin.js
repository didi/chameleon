
const MvvmCompiler = require('./compiler.js');
class mvvmGraphPlugin {
  constructor(options = {}, platformPlugin) {
    this.options = options;
    this.platformPlugin = platformPlugin;
  }
  apply(compiler) {
    let self = this;
    let mvvmCompiler = new MvvmCompiler(compiler, self.platformPlugin);
    compiler._mvvmCompiler = mvvmCompiler;
    // 监听cml中查找组件
    cml.event.on('find-component', function({context, cmlFilePath, comPath, cmlType}, result) {
      // 如果是当前端 则触发用户的查找事件
      if (cmlType === self.options.cmlType) {
        mvvmCompiler.emit('find-component', {context, cmlFilePath, comPath, cmlType}, result);
      }
    })
    self.platformPlugin.register(mvvmCompiler);
    compiler.plugin('should-emit', function(compilation) {      
      mvvmCompiler.run(compilation.modules);
      // 返回false 不进入emit阶段
      return false;      
    })
    
  }
}

module.exports = mvvmGraphPlugin;