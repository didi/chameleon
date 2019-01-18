var utils = require('./utils')


module.exports = function ({type, hot, disableExtract, media, mode}) {
  let extract = hot !== true && disableExtract !== true;
  return {
    loaders: utils.cssLoaders({
      sourceMap: false,
      extract,
      type,
      media,
      mode
    })
  }
}
