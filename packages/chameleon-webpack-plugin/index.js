
const moduleIdHandler = require('./lib/moduleId.js');
const chunkhashHandler = require('./lib/chunkhash.js');
class ChameleonWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      openModuleHash: false, // 是否处理moduleId
      openChunkHash: false,
      hashFunction: "md5",
      hashDigest: "base64",
      hashDigestLength: 4,
      cliName: 'chameleon-tool' // 替换moduleName的正则
    }, options);
    this.algorithm = options.algorithm || 'md5';
    this.digest = options.digest || 'hex';
    this.additionalHashContent = options.additionalHashContent || function() {return '';};

  }

  apply(compiler) {
    const options = this.options;
    if (options.openModuleHash) {
      moduleIdHandler.call(this, compiler, options);
    }
    if (options.openChunkHash) {
      chunkhashHandler.call(this, compiler);
    }
  }
}

module.exports = ChameleonWebpackPlugin;
