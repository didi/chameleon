const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
class CopyNpmPLugin {
  constructor(options) {
    this.cmlType = options.cmlType;
    this.root = options.root;
  }
  apply(compiler) {
    let self = this;

    if (compiler.hooks) {
      compiler.hooks.afterEmit.tap('CopyNpmPLugin', copyNpm);
    } else {
      compiler.plugin('after-emit', copyNpm);
    }

    function copyNpm(compilation, callback) {
      let copyNpm = cml.config.get().copyNpm && cml.config.get().copyNpm[self.cmlType];
      if (copyNpm && copyNpm.length > 0) {
        copyNpm.forEach(function(npmName) {

          let packageRoot = path.join(cml.projectRoot, 'node_modules', npmName);
          let packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), {encoding: 'utf-8'}));
          let cmlConfig = packageJson.cml && packageJson.cml[self.cmlType]; 

          let copyArray = [];
          if (cmlConfig.pages && cmlConfig.pages.length > 0) {
            copyArray = copyArray.concat(cmlConfig.pages)
          }
          if (cmlConfig.components && cmlConfig.components.length > 0) {
            copyArray = copyArray.concat(cmlConfig.components)
          }
          copyArray.forEach(copyItem => {
            let globPath = path.join(packageRoot, `${copyItem}.*`);
            let copyFiles = glob.sync(globPath);
            copyFiles.forEach(file => {
              let dest = path.join(self.root, copyItem + path.extname(file));
              fse.copySync(file, dest)
            })
          })

        })
      }

      return callback()
    }


  }
}

module.exports = CopyNpmPLugin;


