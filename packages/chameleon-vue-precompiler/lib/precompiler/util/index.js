const ast = require('./ast')
exports.ast = ast

exports.extend = function (to, from) {
  if (!to) { return }
  const args = Array.prototype.slice.call(arguments, 1)
  for (let i = 0, l = args.length; i < l; i++) {
    const from = args[i]
    if (!from) { continue }
    for (const k in from) {
      if (from.hasOwnProperty(k)) {
        to[k] = from[k]
      }
    }
  }
  return to
}

const ARRAY_STRING = '[object Array]'
exports.isArray = function (arr) {
  return toString.call(arr) === ARRAY_STRING
}

const camelizeRE = /-(\w)/g
exports.camelize = str => {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase())
}

const hyphenateRE = /([^-])([A-Z])/g
exports.hyphenate = str => {
  return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase()
}

exports.getStaticStyleObject = function (el) {
  let staticStyle = el.staticStyle
  try {
    staticStyle = JSON.parse(staticStyle)
  }
  catch (e) {
    staticStyle = {}
  }
  return staticStyle || {}
}

exports.mergeStringArray = function () {
  const arrs = Array.prototype.slice.call(arguments)
  const arrMap = {}
  for (let i = 0, l = arrs.length; i < l; i++) {
    const arr = arrs[i]
    for (let j = 0, len = arr.length; j < len; j++) {
      arrMap[arr[j]] = true
    }
  }
  return Object.keys(arrMap)
}
