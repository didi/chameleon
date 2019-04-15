
/** 为style模块包装 防止webpack build moudle error */
module.exports = function(content) {
  this._module._nodeType = 'module';
  this._module._moduleType = 'style';
  this._module._cmlSource = content;

  return `module.exports = ${JSON.stringify(content)}`
}
