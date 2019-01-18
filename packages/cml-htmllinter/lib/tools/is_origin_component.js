module.exports.isOriginComponent = function(element) {
  if (element && element.type === 'tag') {
      return /^origin-\w+/.test(element.name);
  } else {
      return false;
  }
}