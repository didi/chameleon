module.exports.isOriginComponent = function(tag) {
  return tag ? /^origin-\w+/.test(tag.name) : false;
}
