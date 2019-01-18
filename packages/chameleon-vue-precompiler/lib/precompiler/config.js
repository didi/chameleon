const util = require('./util')

const vendorReg = /webkit|moz/i
function hyphen (key) {
  return util.hyphenate(key.replace(vendorReg, function ($0) {
    return `-${$0.toLowerCase()}-`
  }))
}

function formatStyleNames (scaleStyles) {
  return Object.keys(scaleStyles.reduce(function (pre, key) {
    pre[key] = 1
    pre[hyphen(key)] = 1
    return pre
  }, {}))
}

const COM_FIELDS = [
  'cmlRegisteredComponents',
  'cmlBuiltInComponents',
  'cmlComponents'
]

const EXTRA_FIELDS = {
  px2rem: function (config, usrConf) {
    const { px2rem } = usrConf
    const { px2rem: thisPx2rem } = config
    if (px2rem) {
      for (let k in px2rem) {
        if (k === 'rootValue') {
          // ignore rootValue. Always use 750. Why? We use meta[name=cml-viewport] and
          // meta.setViewport API to set design viewport width, and they would be broken if
          // we use other rootValue here.
          continue
        }
        else if (px2rem.hasOwnProperty(k)) {
          thisPx2rem[k] = px2rem[k]
        }
      }
    }
    return thisPx2rem
  }
}

let config = {
  eventMap: {
    click: 'cml$tap',
    scroll: 'cml$scroll'
  },
  // these components should not bind events with .native.
  cmlBuiltInComponents: [
    'div',
    'container',
    'text',
    'image',
    'img',
    'cell',
    'a'
  ],
  // these components should auto bind events with .native.
  cmlRegisteredComponents: [
    'input',
    'switch',
    'list',
    'scroller',
    'waterfall',
    'header',
    'loading',
    'refresh',
    'loading-indicator',
    'slider',
    'cycleslider',
    'slider-neighbor',
    'indicator',
    'textarea',
    'video',
    'web'
  ],
  cmlComponents: [
    // cml components
    'tabheader',
    'mask',
    'richtext',
    'appbar',
    'parallax'
  ],
  // add .stop to stop propagation for cml native events only.
  // user defined events may not have the stopPropagation method.
  cmlEvents: [
    'click',
    'tap',
    'scroll',
    // gesture
    'touchstart',
    'touchend',
    'touchmove',
    'swipe',
    'panstart',
    'panmove',
    'panend',
    'longpress',
    'long',
    // input & switch & slider
    'input',
    'key',
    'keyup',
    'keydown',
    'return',
    'change',
    'focus',
    'blur',
    'active',
    // appear series.
    'appear',
    'disappear',
    'offsetAppear',
    'offsetDisappear',
    // refresh & loading
    'refresh',
    'pullingdown',
    'loading',
    // video
    'start',
    'pause',
    'finish',
    'fail'
  ],
  autoprefixer: {
    browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
  },
  px2rem: {
    rootValue: 75,
    minPixelValue: 1.01
  },
  bindingStyleNamesForPx2Rem: formatStyleNames([
    'width',
    'height',
    'left',
    'right',
    'top',
    'bottom',
    'border',
    'borderRadius',
    'borderWidth',
    'borderLeft',
    'borderRight',
    'borderTop',
    'borderBottom',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'borderBottomWidth',
    'margin',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'padding',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'fontSize',
    'lineHeight',
    'transform',
    'webkitTransform',
    'WebkitTransform',
    'mozTransform',
    'MozTransform',
    'itemSize'
  ])
}

exports.get = function() {
  return config
}

config.preservedTags = config.cmlBuiltInComponents.concat(config.cmlRegisteredComponents)

exports.merge = function(usrConf) {
  if (!usrConf) {
    return
  }

  // merge COM_FIELDS fields.
  mergeComponentField(usrConf)

  // merge all fields except COM_FIELDS.
  mergeExtra(usrConf)
}

function mergeComponentField(usrConf) {
  COM_FIELDS.forEach(function (name) {
    const vals = usrConf[name]
    if (util.isArray(vals)) {
      config[name] = util.mergeStringArray(
        config[name],
        vals
      )
    }
  })
}

function mergeExtra(usrConf) {
  for (const k in usrConf) {
    if (COM_FIELDS.indexOf(k) <= -1) {
      config[k] = EXTRA_FIELDS[k] ? EXTRA_FIELDS[k](config, usrConf): usrConf[k]
    }
  }
}

