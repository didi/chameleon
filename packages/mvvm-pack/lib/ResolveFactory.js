
const { ResolverFactory, NodeJsInputFileSystem, CachedInputFileSystem} = require('enhanced-resolve');
const path = require('path');
module.exports = function(options) {

  let defaultOptions = {
    extensions: ['.cml', '.interface', '.vue', '.js', '.json'],
    alias: {
      '$CMLPROJECT': path.join(options.cmlRoot),
      '$PROJECT': path.join(options.projectRoot)
    },
    modules: [
      'node_modules',
      path.join(options.cmlRoot, '/node_modules')
    ],
    "unsafeCache": true,
    "mainFiles": ["index"],
    "aliasFields": ["browser"],
    "mainFields": ["browser", "module", "main"],
    "cacheWithContext": false}
  options.config = options.config || {}
  options.config.resolve = options.config.resolve || {};

  return ResolverFactory.createResolver(Object.assign(
    {
      useSyncFileSystemCalls: true,
      fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 4000)
    },
    defaultOptions,
    options.config.resolve
  ))

}
