/*
Inter-loader Option Cache

Vue-loader works by delegating language blocks to sub-loaders.
The main loader needs to share its options object with the sub-loaders.
Technically we should pass everything the sub loaders need via their own
options, however there are two problems with this approach:

1. Some options (e.g. postcss, compilerModules) may contain non-serializable
   values and cannot be passed via inline requests
2. Passing everything via inline requests makes the module string extremely
   verbose, and can be quite annoying in error messages.

To get around this, we cache the options in this module here in order to share
it between loaders.

- In order to support multiple uses of vue-loader with different options,
each options object is cached with an id.
- To share options across threads in threadMode, options are serialized and
cached on disk.
*/

const fs = require('fs')
const path = require('path')
const hash = require('hash-sum')

const optionsToId = new Map()
const idToOptions = new Map()

exports.saveOptions = options => {
  if (optionsToId.has(options)) {
    return optionsToId.get(options)
  }

  const threadMode = options && options.threadMode
  const serialized = threadMode ? serialize(options) : null
  const id = serialized ? hash(serialized) : String(idToOptions.size)

  idToOptions.set(id, options || {})
  optionsToId.set(options, id)

  if (options && serialized) {
    const fsidToOptionsPath = getidToOptionsPath(id)
    if (!fs.existsSync(fsidToOptionsPath)) {
      fs.writeFileSync(fsidToOptionsPath, serialized)
    }
  }

  return id
}

exports.loadOptions = id => {
  const res = idToOptions.get(id)
  if (res) {
    return res
  }
  const fsidToOptionsPath = getidToOptionsPath(id)
  if (fs.existsSync(fsidToOptionsPath)) {
    return JSON.parse(fs.readFileSync(fsidToOptionsPath, 'utf-8'))
  } else {
    return {}
  }
}

function serialize (options) {
  let res
  try {
    res = JSON.stringify(options)
  } catch (e) {
    throw new Error(`options must be JSON serializable in thread mode.`)
  }
  return res
}

function getidToOptionsPath (id) {
  return path.resolve(__dirname, `.options-cache-${id}`)
}
