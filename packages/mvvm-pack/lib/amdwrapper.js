
module.exports = function({content, modId}) {
  if (!/^\s*cmldefine\s*\(/.test(content)) {
    content = 'cmldefine(\'' + modId + '\', function(require, exports, module){ ' + content +
        ' \r\n});';
  }

  return content;
}