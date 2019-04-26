module.exports = function urlToRequire (url) {
  // same logic as in transform-require.js
  const firstChar = url.charAt(0)
  if (firstChar === '.' || firstChar === '~' || firstChar === '@') {
    if (firstChar === '~') {
      const secondChar = url.charAt(1)
      url = url.slice(secondChar === '/' ? 2 : 1)
    }
    return `require("${url}")`
  } else {
    return `"${url}"`
  }
}
