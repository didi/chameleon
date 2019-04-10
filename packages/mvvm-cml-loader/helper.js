const path = require('path');

exports.stringifyLoaders = function (loaders) {
  return loaders
    .map(
      obj =>
        obj && typeof obj === 'object' && typeof obj.loader === 'string'
          ? obj.loader +
            (obj.options ? '?' + JSON.stringify(obj.options) : '')
          : obj
    )
    .join('!')
}

exports.getSelector = function() {
  return path.resolve(__dirname, './selector.js')
}

exports.getPartLoaders = function({selectorOptions, partType, lang, loaders, resourcePath}) {
  selectorOptions.partType = partType;

  let resultLoaders = [
    {
      loader: exports.getSelector(),
      options: selectorOptions
    }
  ]
  switch (partType) {
    case 'style':
      var styleLoader = loaders[lang];
      resultLoaders = styleLoader.concat(resultLoaders);
      break;
    case 'script':
      var jsLoader = loaders.js;
      resultLoaders = jsLoader.concat(resultLoaders);
      break;
    default:
      break;
  }
  let stringLoaders = exports.stringifyLoaders(resultLoaders);
  return '!' + stringLoaders + '!' + resourcePath;
}
