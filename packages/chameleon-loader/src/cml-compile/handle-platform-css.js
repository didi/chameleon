
const postcss = require('postcss');
// 原生组件引用的样式 @import './xxx'  不带平台样式后缀，less会默认添加less导致无法识别需要人工处理
const handleCssSuffix = postcss.plugin('handleCssSuffix', function(options) {
  let {ext} = options;
  return function(css, result) {
    css.walkAtRules('import', function (rule) {
      let params = rule.params;// ./xxx  引用的样式文件路径
      // 注意这里取到的值是带引号的，比如 "./xxx"  './xxx' `./xxx`
      params = params.replace(/"|'|`/g, '');
      if (!params.endsWith(ext)) {
        rule.params = `"${params}${ext}"`
      }
    });
  };
})
module.exports = function(source, options = {}) {
  return postcss([handleCssSuffix(options)]).process(source).css;
}
