const postcss = require('postcss');
// 非rem的cpx处理，rem的利用postcss-plugin-px2rem插件即可实现

module.exports = postcss.plugin('postcss-plugin-cpx', function (options) {
  // parseType 参数决定cpx的转换
  let { unitPrecision = 5, scale = 1, cpxType = 'scale'} = options;
  const pxRegex = /(\d*\.?\d+)cpx/gi;

  const pxReplace = function(m, $1, $2) {
    switch (cpxType) {
      case 'scale':
        return toFixed(parseFloat($1, 10) * scale, unitPrecision) + 'px';
      case 'px':
        return $1 + "px";
      case 'rpx':
        return $1 + "rpx";
      default:
        return m;
    }

  }

  function toFixed(number, precision) {
    var multiplier = Math.pow(10, precision + 1);
    var wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
  }

  return function (css) {
    css.walkDecls(function (decl, i) {
      if (~decl.value.indexOf('cpx')) {
        let value = decl.value.replace(pxRegex, pxReplace);
        decl.value = value;
      }
    });

    css.walkAtRules('media', function (rule) {
      if (!rule.params.indexOf('cpx')) {
        rule.params = rule.params.replace(pxRegex, pxReplace);
      }
    });
  };
});
