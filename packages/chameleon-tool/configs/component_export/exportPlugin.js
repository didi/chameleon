const fse = require('fs-extra')
const path = require('path')
const dependencies = require('./dependencies');

class ExportPlugin {
  constructor(opts) {
    this.exportType = opts.exportType;
    this.mode = opts.mode;
    this.dependency = {};
  }

  apply(compiler) {
    const exportType = this.exportType;
    if (this.mode === 'production') {
      if (compiler.hooks) {
        compiler.hooks.afterEmit.tapAsync('export-plugin', emitCommonFile);
      } else {
        compiler.plugin('after-emit', emitCommonFile);
      }
    } else if (this.mode === 'develop') {
      if (compiler.hooks) {
        compiler.hooks.shouldEmit.tap('export-plugin', shouldEmit);
      } else {
        compiler.plugin('should-emit', shouldEmit);
      }
    }
    function emitCommonFile(compilation, cb) {
      let { options } = compilation;
      if (exportType === 'web') {
        fse.copySync(path.resolve(__dirname, '../web_global.css'), path.resolve(options.output.path, "common/web_global.css"));
        fse.copySync(path.resolve(__dirname, '../web_global.js'), path.resolve(options.output.path, "common/web_global.js"));
      }
      cb && cb();
    }

    function shouldEmit(compilation) {
      let { assets, options } = compilation;
      for (let key in assets) {
        if (assets.hasOwnProperty(key)) {
          if (/\?__export$/.test(key)) {
            assets[key.replace(/\?__export$/, '')] = assets[key];
          }
          delete assets[key];
        }
      }
      if (exportType === 'web') {
        fse.copySync(path.resolve(__dirname, '../web_global.css'), path.resolve(options.output.path, "common/web_global.css"));
        fse.copySync(path.resolve(__dirname, '../web_global.js'), path.resolve(options.output.path, "common/web_global.js"));
        fse.copySync(path.resolve(__dirname, './webpack.web.config.js'), path.resolve(options.output.path, "build/webpack.cml.config.js"));
      }
      if (exportType === 'weex') {
        fse.copySync(path.resolve(__dirname, './webpack.weex.config.js'), path.resolve(options.output.path, "build/webpack.cml.config.js"));
      }
      fse.writeFileSync(`${options.output.path}/dependencies.json`, dependencies.getDependencies())
      return true;
    }
  }

}

module.exports = ExportPlugin;
