const path = require('path');
const utils = require('chameleon-tool-utils');

/**
 *  解决window系统中删除小程序文件夹失败
 *  */

class CMLCleanPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const options = this.options;
    clean.call(this);
    function clean() {
      options.paths.forEach(item => {
        item = path.join(options.root, item);
        try {
          utils.removeSync(item);
        } catch (e) {
          utils.log.error(`please delete ${item} by yourself`);
          throw e;
        }
      })
    }
  }
}

module.exports = CMLCleanPlugin;


