const postcss = require('postcss');
const fnv = require('fnv-plus');

module.exports = postcss.plugin('add-alipay-class-name', function(options) {
  let { filePath} = options;
  let num = 32;
  let randomClassName = fnv.hash(filePath, num).str();
  options.alipayClassName = `.cml-${randomClassName}`;
  return function(css, result) {
    function getSelector (value) {
      let temp = '';
      for (let i = 0, len = value.length; i < len; i++) {
        if (value[i] === '.') {
          temp += `${options.alipayClassName}.`
        } else {
          temp += value[i];
        }
      }
      return temp;
    }
    css.walkRules(rule => {
      if (rule.selector.indexOf('.') === 0) {
        let newSelector = getSelector(rule.selector);
        rule.selector = newSelector;
      }
    });
  };
})
