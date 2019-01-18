// const wxStyle = require('chameleon-loader/lib/cml-compile/wx-style-handle.js')

function type(n) {
  return Object.prototype.toString.call(n).slice(8, -1)
}

function middleware(obj, map, lifecycle) {
  for (let key of Object.keys(map)) {
    if (obj.hasOwnProperty(key)) {
      obj['_' + key] = obj[key]
      map['_' + key] = map[key]
      delete obj[key]
      delete map[key]
    }
  }
}

/**
 * 生命周期映射
 * @param  {Object} obj 待添加属性对象
 * @param  {Object} map 映射表
 * @param  {Object} lifecycle 生命周期序列 确保顺序遍历
 * @return {Object}     修改后值
 */
export function lifecycleHandler(obj, map, lifecycle) {
  // 将生命周期 键名 处理成 ['_' + key]
  lifecycle = lifecycle.map(key => '_' + key)

  middleware(obj, map)

  lifecycle.forEach(function(key) {
    var mapVal = map[key]
    var objVal = obj[key]

    if (obj.hasOwnProperty(key)) {
      if (obj.hasOwnProperty(mapVal)) {
        if (type(obj[mapVal]) !== 'Array') {
          obj[mapVal] = [obj[mapVal], objVal]
        } else {
          obj[mapVal].push(objVal)
        }
      } else {
        obj[mapVal] = [objVal]
      }
      delete obj[key]
    }
  })
  return obj
}

/**
 * 对象键名重定义
 * @param  {Object} obj     对象
 * @param  {String} oldKey    原键名
 * @param  {String} newKey 新键名
 * @return {Object}         新对象
 */
export function rename(obj, oldKey, newKey) {
  Object.getOwnPropertyNames(obj).forEach(function(key) {
    if (key === oldKey) {
      obj[newKey] = obj[key]
      delete obj[key]
      return obj
    }
  })
  return obj
}

/**
 * 处理组件props属性
 * @param  {Object} obj 组件options
 * @return {[type]}     [description]
 */
export function propsHandler(obj) {
  if (obj.props) {

    Object.getOwnPropertyNames(obj.props).forEach(function(name) {
      let prop = obj.props[name]

      if (type(prop) === 'Object' && prop.hasOwnProperty('default')) {
        rename(prop, 'default', 'value')
      }
    })

    rename(obj, 'props', 'properties')
  }
  return obj
}

/**
 * 添加处理动态style的方法
 * @param {*} obj
 */
// export function addStyleHandle(obj) {
//   obj.methods = obj.methods || {}
//   obj.methods[wxStyle.methodKey] = function(content) {
//     return wxStyle.wxStaticStyle(content)
//   }
// }
