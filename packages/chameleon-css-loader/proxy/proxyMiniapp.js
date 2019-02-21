const utils = require('../utils');
const lines = require('../handler/lines');
// 运行时的cpx2rpx不能使用postcss处理，因为$cmlStyle方法用到了该方法，在运行时使用postcss 会出现Cannot find module "fs"的错误
module.exports = function(content) {
  content = utils.disappearCssComment(content);
  return parse(content);
  function parse (style) {
    return style
      .split(';')
      .filter(declaration => !!declaration.trim())
      .map(declaration => {
        let {key, value} = utils.getStyleKeyValue(declaration);
        return {
          property: key,
          value
        };
      })
      .map(declaration => {
        if (declaration.property === 'lines') {
          return lines(declaration.value);
        }
        declaration.value = handle(declaration.value);
        return declaration.property + ':' + declaration.value;
      })
      .join(';')
  }

  function handle(content) {
    if (content && content.replace) {
      content = content.replace(/(\d*\.?\d+)cpx/ig, function (m, $1) {
        return $1 + 'rpx'
      })
    }
    return content
  }

}
