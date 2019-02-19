var postcss = require('postcss');

module.exports = postcss.plugin('add-alipay-class-name', function(options) {
  return function(css, result) {
    css.walkRules(rule => {
      if (rule.selector.indexOf('.') === 0) {
        rule.selector = `${options.alipayClassName}${rule.selector}`
      }
    });
  };
})
