/* eslint-disable */

/**
 * 对象属性 `data` 的 映射
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export function genConfig(obj) {
  Object.getOwnPropertyNames(obj).forEach(function(key) {
    if (key === 'data') {
      var _temp = obj['data']
      obj['data'] = function() {
        return {
          ..._temp
        }
      }

      return obj
    }
  })
  return obj
}

/**
 * 添加处理动态style的方法
 * @param {*} obj 
 */
// export function addStyleHandle(obj) {
//   obj.methods = obj.methods || {}
//   obj.methods[weexStyle.methodKey] = function(content) {
//     return weexStyle.weexStaticStyle(content)
//   }
// }
