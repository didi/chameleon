/**
 * js 模块获取节点源代码，在interface-loader处理后 babel-loader前
 */
module.exports = function (output) {
  this._module._cmlOriginSource = output;
  return output;
}
