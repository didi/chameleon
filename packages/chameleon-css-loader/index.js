const loaderUtils = require('loader-utils')
const webParse = require('./parser/web');
const miniParse = require('./parser/miniapp');
const weexParse = require('./parser/weex');
const mediaParse = require('./parser/media');

module.exports = function(source, options) {
  options = options || loaderUtils.getOptions(this);
  options.filePath = this.resourcePath;
  // 处理差异化的media代码块功能
  if (options.media) {
    return mediaParse(source, options.cmlType);
  }
  debugger;

  if (source) {
    let result;
    switch (options.platform) {
      case 'web': result = webParse(source, options); break;
      case 'miniapp': result = miniParse(source, options); break;
      case 'weex': result = weexParse(source, options); break;
      default: break;
    }
    return result;
  }
  return source;
}


