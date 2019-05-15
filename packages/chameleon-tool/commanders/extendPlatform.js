

const mvvmpack = require('mvvm-pack');
const path = require('path');

// 扩展端的构建
module.exports = function({platform, media}) {
  let npmName = cml.config.get().platformPlugin[platform];
  let PlatformPlugin = require(path.join(cml.projectRoot, 'node_modules', npmName)); // eslint-disable-line
  let plugin = new PlatformPlugin();
  // merge用户自定义配置
  cml.config.merge({
    [platform]: plugin.config
  })
  let config = cml.config.get();
  let mediaConfig = cml.config.get()[platform][media];
  let mvvmOptions = {
    config: {
      check: config.check,
      output: {
        publicPath: mediaConfig.publicPath
      }
    },
    logLevel: plugin.logLevel,
    cmlType: platform,
    media,
    cmlRoot: cml.root,
    projectRoot: cml.projectRoot
  }

  let compiler = new mvvmpack(mvvmOptions);
  plugin.register(compiler);
  let startTime = Date.now();
  compiler.hook('start-run', function(time) {
    startTime = time;
    cml.log.notice(platform + ' Compiling...')
  })
  compiler.hook('end-run', function(time) {
    cml.log.notice(platform + ' Compiled successfully in ' + (time - startTime) + 'ms')
  })
  if (media === 'dev') {
    compiler.watch(200, function() {
    });
  } else {
    compiler.run()
  }
}