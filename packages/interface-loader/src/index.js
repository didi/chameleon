
const loaderUtils = require('loader-utils')
const mvvmInterfaceParser = require('mvvm-interface-parser');
const path = require('path')
module.exports = function (source) {
  const rawOptions = loaderUtils.getOptions(this);
  const options = rawOptions || {};
  // loader的类型  wx  web weex
  let {cmlType, media, check = {}} = options;
  const filePath = this.resourcePath;
  let self = this;
  debugger
  const resolve = function(filePath, relativePath) {

    let context = path.dirname(filePath);
    self.resolveSync(context, relativePath);
  }
  // todo
  let {result, devDeps} = mvvmInterfaceParser({cmlType, media, source, filePath, check});
  devDeps.forEach(item => {
    this.addDependency(item);
  })
  return result;
}
