var REQUIRE_REG = /require\((["'])@weex\-module\/([^\)\1]+)\1\)/g

module.exports = function (content) {
  this.cacheable && this.cacheable()
  return content.replace(REQUIRE_REG, '__weex_require_module__($1$2$1)')
}
