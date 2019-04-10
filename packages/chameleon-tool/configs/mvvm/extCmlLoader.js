
const loaderUtils = require('loader-utils')

module.exports = function(source) {
  const self = this;
  const rawOptions = loaderUtils.getOptions(this) || {};
  const context = (
    this.rootContext ||
    (this.options && this.options.context) ||
    process.cwd()
  )

  function getPartLoaders(part) {
    let loaders = self.loaders.map(loader => {
      let loaderOptions = loader.options || {}
      let options = {
        part
      }
      return {
        loader: loader.path,
        options: {
          ...loaderOptions,
          ...options
        }
      }
    })
    let stringLoaders = stringifyLoaders(loaders);
    let resourcePath = self.resourcePath;
    return  '!'+stringLoaders + '!' + resourcePath;
  }

  if (!rawOptions.part) {
    debugger

    source = `

      var template = require('${getPartLoaders('template')}');
      var style = require('${getPartLoaders('style')}');
      var json = require('${getPartLoaders('json')}');
      var script = require('${getPartLoaders('script')}');

      module.exports = {
        template,
        style,
        json,
        script
      }
    `  
  
    console.log(source);
    debugger
  } else {
    debugger
    source = rawOptions.part
  }

  return source;
}

function stringifyLoaders (loaders) {
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