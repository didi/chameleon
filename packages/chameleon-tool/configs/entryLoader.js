/*
将 import router from '$ROUTER 转化为
import router from '$ROUTER?query=0'; //'$ROUTER?query=1'之类的
转化比较简单，可以用正则，该文件源文件在 configs/default/entry.js 中
*/

module.exports = function(content) {
  this.cacheable(false);
  const resourceQuery = this.resourceQuery
  return content.replace('$ROUTER', `$ROUTER${resourceQuery}`)
}
