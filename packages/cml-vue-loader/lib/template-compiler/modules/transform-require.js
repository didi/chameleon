// vue compiler module for transforming `<tag>:<attribute>` to `require`

const urlToRequire = require('../url-to-require')

const defaultOptions = {
  video: ['src', 'poster'],
  source: 'src',
  img: 'src',
  image: 'xlink:href'
}

module.exports = userOptions => {
  const options = userOptions
    ? Object.assign({}, defaultOptions, userOptions)
    : defaultOptions

  return {
    postTransformNode: node => {
      transform(node, options)
    }
  }
}

function transform (node, options) {
  for (const tag in options) {
    if ((tag === '*' || node.tag === tag) && node.attrs) {
      const attributes = options[tag]
      if (typeof attributes === 'string') {
        node.attrs.some(attr => rewrite(attr, attributes))
      } else if (Array.isArray(attributes)) {
        attributes.forEach(item => node.attrs.some(attr => rewrite(attr, item)))
      }
    }
  }
}

function rewrite (attr, name) {
  if (attr.name === name) {
    const value = attr.value
    // only transform static URLs
    if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      attr.value = urlToRequire(value.slice(1, -1))
      return true
    }
  }
}
