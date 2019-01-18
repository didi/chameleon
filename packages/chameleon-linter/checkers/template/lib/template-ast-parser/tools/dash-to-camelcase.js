module.exports.dashtoCamelcase = function(str = '') {
  return str && str.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
}
