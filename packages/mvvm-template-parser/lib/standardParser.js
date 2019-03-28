const parser = require('@didi/mvvm-babel-parser');

module.exports = function({source, lang = "cml"}) {
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  return {
    convert: ast,
    output: source
  }
}
