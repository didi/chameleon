const _ = module.exports = {};

_.getStyleKeyValue = function(declaration) {
  let colonIndex = declaration.indexOf(':');
  let key = declaration.slice(0, colonIndex);
  let value = declaration.slice(colonIndex + 1);
  return {
    key, value
  }
}

