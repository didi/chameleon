/** 提供编译时样式处理的方法 */
// 运行时不能使用postcss 体积过大
const lines = require('../handler/lines');
const utils = require('../utils');

module.exports = function(content, options) {
  if (typeof options === 'string') {
    options = JSON.parse(utils.singlequot2doublequot(options))
  }
  if (typeof content !== 'string') {
    throw new Error(`expected the value of style is string but get ${typeof content}`);
  }
  content = utils.disappearCssComment(content);
  content = utils.uniqueStyle(content);
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
        declaration.value = handle(declaration.value, options);
        return declaration.property + ':' + declaration.value;
      })
      .join(';')
  }

  function handle(content, options) {
    const pxRegex = /(\d*\.?\d+)cpx/gi;
    let unitPrecision = 5;
    function toFixed(number, precision) {
      var multiplier = Math.pow(10, precision + 1);
      var wholeNumber = Math.floor(number * multiplier);
      return Math.round(wholeNumber / 10) * 10 / multiplier;
    }
    if (options.rem === true) {
      let base = options.remOptions.rootValue.cpx;
      return content.replace(pxRegex, function(m, $1) {
        return toFixed(parseFloat($1, 10) / base, unitPrecision) + 'rem';
      })

    } else {
      let scale = options.scale;
      return content.replace(pxRegex, function(m, $1) {
        return toFixed(parseFloat($1, 10) * scale, unitPrecision) + 'px';
      })

    }
  }
}


