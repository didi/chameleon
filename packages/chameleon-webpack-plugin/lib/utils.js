


module.exports.chameleonHandle = function (content, cliName) {
  // 首先是把chameleon-cli前面的删除，然后就是loader中的
  let reg = new RegExp(`[\\.\\/]+?([^\\"\\'\\/\\?\\!\\&]+\/)*?${cliName}`, 'g')
  content = content.replace(reg, function(m, s1) {
    return `${cliName}`
  })
  return content;
}
