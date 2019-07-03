
exports.tagMap = {
  targetTagMap: {
    'cover-view': {
      wx: 'cover-view',
      web: 'div',
      weex: 'div',
      alipay: 'cover-view',
      baidu: 'cover-view'
    },
    'cover-image': {
      wx: 'cover-image',
      web: 'img',
      weex: 'image',
      alipay: 'cover-image',
      baidu: 'cover-image'
    },
    'view': {
      wx: 'view',
      web: 'div',
      weex: 'div',
      alipay: 'view',
      baidu: 'view'
    },
    'text': {
      wx: 'text',
      web: 'span',
      weex: 'text',
      alipay: 'text',
      baidu: 'text'
    },
    'image': {
      wx: 'image',
      web: 'img',
      weex: 'image',
      alipay: 'image',
      baidu: 'image'
    },
    'input': {
      wx: 'input',
      web: 'input',
      weex: 'input',
      alipay: 'input',
      baidu: 'input'
    },
    'button': {
      wx: 'button',
      web: 'div',
      weex: 'div',
      alipay: 'button',
      baidu: 'button'
    },
    'cell': {
      wx: 'view',
      web: 'cell',
      weex: 'cell',
      alipay: 'view',
      baidu: 'view'
    },
    'slider-item': {
      wx: 'swiper-item',
      web: 'div',
      weex: 'div',
      alipay: 'swiper-item',
      baidu: 'swiper-item'

    }
  },
  afterTagMap: {
    // 在最后处理的标签，因为template标签在jsdom中不识别
    'block': {
      wx: 'block',
      web: 'template',
      weex: 'template',
      alipay: 'block',
      baidu: 'block'
    }
  },
  diffTagMap: {
    wx: ['cml-wx'],
    web: ['cml-web', 'cml-web-weex'],
    weex: ['cml-weex', 'cml-web-weex'],
    alipay: ['cml-ali'],
    baidu: ['cml-baidu']
  },
  wxTagMap: {
    "carousel": "swiper",
    "carousel-item": "swiper-item"
  }
}
exports.conditionMap = {
  'c-if': {
    web: 'v-if',
    weex: 'v-if',
    wx: 'wx:if',
    alipay: 'a:if',
    baidu: 's-if'
  },
  'c-else-if': {
    web: 'v-else-if',
    weex: 'v-else-if',
    wx: 'wx:elif',
    alipay: 'a:elif',
    baidu: 's-elif'
  },
  'c-else': {
    web: 'v-else',
    weex: 'v-else',
    wx: 'wx:else',
    alipay: 'a:else',
    baidu: 's-else'
  }
}
exports.interationMap = {
  'c-for': {
    wx: 'wx:for',
    alipay: 'a:for',
    baidu: 's-for'
  },
  'c-key': {
    wx: 'wx:key',
    alipay: 'a:key',
    baidu: 's-key'// 百度文档没有提到这个，黑人问号脸
  },
  'c-for-item': {
    wx: 'wx:for-item',
    alipay: 'a:for-item',
    baidu: 's-for-item'
  },
  'c-for-index': {
    wx: 'wx:for-index',
    alipay: 'a:for-index',
    baidu: 's-for-index'
  }
}
exports.eventMap = {
  "touchstart": "touchStart",
  "touchmove": "touchMove",
  "touchend": "touchEnd",
  "touchcancel": "touchCancel",
  "longtap": "longTap"
}
exports.conditionMapVue2Wx = {
  'v-if': {
    wx: 'wx:if',
    alipay: 'a:if',
    baidu: 's-if'
  },
  'v-else-if': {
    wx: 'wx:elif',
    alipay: 'a:elif',
    baidu: 's-elif'
  },
  'v-else': {
    wx: 'wx:else',
    alipay: 'a:else',
    baidu: 's-else'
  }
}
