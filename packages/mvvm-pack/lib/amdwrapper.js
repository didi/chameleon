
module.exports = function({content, modId}) {
  if (!/^\s*cmldefine\s*\(/.test(content)) {
    content = `\ncmldefine('${modId}', function(require, exports, module) {
  ${content}
})`;
  }
  return content;
}