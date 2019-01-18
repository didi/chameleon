const map = {
    span: ['text', 'span'],
    div: ['view', 'cell', 'cover-view', 'button', 'slider-item', 'div'],
    template: ['block', 'template'],
    img: ['image', 'img']
  }
  
  const tagMap = Object.keys(map).reduce(function (pre, toTag) {
    const tagArr = map[toTag]
    tagArr.forEach(function (fromTag) {
      pre[fromTag] = toTag
    })
    return pre
  }, {})
  
  exports.transformTag = function (el) {
    const toTag = tagMap[el.tag]
    if (toTag) {
      el._origTag = el.tag
      el.tag = toTag
    }
    return el.tag
  }
  