const path = require('path');
const crypto = require('crypto');
const _ = module.exports = {};

_.createMd5 = function(content) {
  let md5 = crypto.createHash('md5');
  md5.update(content);
  return md5.digest('hex');
}

_.delQueryPath = function(filePath) {
  return filePath.split('?')[0];
}

_.splitFileName = function(filePath) {
  let basename = path.basename(_.split('?')[0]);
  return basename.split('.');
}

_.isInline = function(filePath) {
  if (~filePath.indexOf("__inline")) {
    return true;
  }
  return false;
}
