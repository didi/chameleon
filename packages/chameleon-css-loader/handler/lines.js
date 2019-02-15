// web和小程序端对lines属性特殊处理

module.exports = function(linesNumber) {
  return `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden`
}
