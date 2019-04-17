
const {assets} = require('./lib.js');

/** 
 * 1.为style模块包装 防止webpack build moudle error
 * 2.处理css中的静态资源 css中改成绝对路径 loader过后进行替换publicPath
 */
module.exports = function(content) {
  debugger
  this._module._nodeType = 'module';
  this._module._moduleType = 'style';
  let {source, deps} = assets({source: content,loaderContext: this});
  this._module._cmlSource = source;
  let output = '';
  deps.forEach(item=>{
    output += `require("${item}")`
  })
  return `
  ${output}
  module.exports = {}`
}



