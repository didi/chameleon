
const Compile = require('./Compile');

/**
 * @param {options} 构建参数
 * @return {Compile} 编译对象
 */
function MVVMPack(options) {
  let compile = new Compile(options);
  return compile;

}
module.exports = MVVMPack;
