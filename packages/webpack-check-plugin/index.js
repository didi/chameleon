const check = require('./lib/check.js');
const chalk = require('chalk');

class WebpackCheckPlugin {
  constructor(options) {
    this.options = Object.assign({
      cmlType: '',
      tokensMap: undefined,
      whiteListFile: []
    }, options);
  }

  apply(compiler) {

    const options = this.options;
    if (compiler.hooks) {
      compiler.hooks.emit.tapAsync('chameleon-plugin', checkModule);
    } else {
      compiler.plugin('emit', checkModule);
    }

    // check babel之后的每一个module
    function checkModule(compilation, callback) {

      var type = options.cmlType;
      compilation.modules.forEach(module => {
        // 项目内的文件做校验
        if (module.resource && module.resource.indexOf(cml.projectRoot) === 0) {
          // 白名单内的文件不做校验

          let whiteListFileLength = options.whiteListFile.length;
          let inWhiteList = false;
          for (let i = 0; i < whiteListFileLength; i++) {
            let item = options.whiteListFile[i];

            if (Object.prototype.toString.call(item) === '[object RegExp]') { // 配置的是正则
              if (item.test(module.resource)) {
                inWhiteList = true;
                break
              }
            }
            if (Object.prototype.toString.call(item) === '[object String]') { // 配置的是绝对路径
              if (module.resource.endsWith(item)) {
                inWhiteList = true;
                break;
              }
            }
          }

          if (!inWhiteList) {

            var source = module._source && module._source._value;
            let sourceLine = source.split('\n');
            try {
              var tokens = check(source, options);
              if (tokens && tokens.length) {
                tokens.forEach(token => {

                  throw new Error(chalk.red(`
                  不能在${type} 项目中使用全局变量【${token.name}】 
                  文件位置: ${module.resource}
                  具体代码: ${sourceLine[token.loc.line - 1]}
                  `))
                })
              }
            } catch (e) {
              console.log(e)
              // babel parse入会有报错的情况
            }
          }

        }

      })
      return callback()
    }


  }
}
module.exports = WebpackCheckPlugin;


