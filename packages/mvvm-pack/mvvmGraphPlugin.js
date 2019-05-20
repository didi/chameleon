
const MvvmCompiler = require('./compiler.js');
class mvvmGraphPlugin {
  constructor(options = {}, platformPlugin) {
    this.options = options;
    this.platformPlugin = platformPlugin;
  }
  apply(compiler) {
    let self = this;
    let mvvmCompiler = new MvvmCompiler(compiler, self.platformPlugin, self.options);
    compiler._mvvmCompiler = mvvmCompiler;
    compiler._platformPlugin = self.platformPlugin;
    // 监听cml中查找组件
    cml.event.on('find-component', function(result) {
      let {cmlType, filePath} = result;
      // 如果是当前端 则进行原生组件查找
      if (cmlType === self.options.cmlType) {
        let extList = self.platformPlugin.originComponentExtList;
        for (let i = 0; i < extList.length; i++) {
          let extFilePath = filePath + extList[i];
          if (cml.utils.isFile(extFilePath)) {
            result.extPath = extFilePath;
            break;
          }
        }
      }
    })
    self.platformPlugin.register(mvvmCompiler);
    compiler.plugin('should-emit', function(compilation) {      
      mvvmCompiler.run(compilation.modules);
      // 返回false 不进入emit阶段
      return false;      
    })

    // 捕获错误
    process.on('uncaughtException', function (err) {
      cml.log.error(err);
    });
  }
}

module.exports = mvvmGraphPlugin;