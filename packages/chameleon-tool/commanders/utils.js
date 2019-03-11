const webpack = require('webpack');
const devServer = require('./web/dev-server.js');
const getConfig = require('../configs/index.js');
const {startServer: startWeexLiveLoad, broadcast} = require('./weex/socket-server.js');
const previewSocket = require('./web/web-socket.js');
const cmlLinter = require('chameleon-linter');
const watch = require('glob-watcher');
const fse = require('fs-extra');

/**
 * 非web端构建
 * @param {*} media  dev or build ...
 * @param {*} type  wx web weex
 */
exports.getBuildPromise = async function (media, type) {

  let options = exports.getOptions(media, type);
  let webpackConfig = await getConfig(options);
  if (~['wx', 'baidu', 'alipay'].indexOf(type)) {
    // 异步删除output目录
    var outputpath = webpackConfig.output.path;
    await new Promise(function(resolve, reject) {
      fse.remove(outputpath, function(err) {
        if (err) {
          reject(err);
        }
        resolve();
      })
    })["catch"](e => {
      let message = `clear file error! please remove direction ${outputpath} by yourself!`
      cml.log.error(message);
      throw new Error(e)
    })

  }
  return new Promise(function(resolve, reject) {
    // watch模式
    if (media === 'dev') {
      const compiler = webpack(webpackConfig);
      if (type === 'weex') {
        startWeexLiveLoad(options);
      }
      compiler.watch({
        // watchOptions 示例
        aggregateTimeout: 300,
        poll: undefined
      }, (err, stats) => {
        if (type === 'weex') {
          broadcast('weex_refresh');
          previewSocket.broadcast('weex_refresh');
        }
        if (err) {
          reject(err);
        }
        resolve();
      });
    } else {
      // build模式
      webpack(webpackConfig, (err, stats) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    }
  })
}

/**
 * 获取webpack配置
 * @param {*} media  dev or build ...
 * @param {*} type  wx web weex
 */
exports.getOptions = function (media, type) {
  let chameleonConfig = cml.config.get()[type][media];

  if (!chameleonConfig) {
    cml.log.error(`在chameleon的config中未找到 ${media}的配置参数`);
    return;
  }

  let options = cml.utils.merge(
    chameleonConfig,
    {
      type: type,
      media,
      root: cml.projectRoot,
      buildType: 'weex' // 传递给dev-server，判断启动devserver的类型 暂时固定为weex
    }
  )

  return options;
}

/**
 * web端构建
 * @param {*} type   dev or build or 其他
 * @param {*} isCompile   是否要编译web端 不编译web时也要启动web端服务
 */
exports.getWebBuildPromise = async function (media, isCompile) {
  if (media === 'dev') {
    let options = exports.getOptions(media, 'web');
    let webpackConfig = await getConfig(options)
    let compiler;
    if (isCompile) {
      compiler = webpack(webpackConfig);
    }
    return devServer({webpackConfig, options, compiler});
  } else {
    return exports.getBuildPromise(media, 'web');
  }
}

/**
 * 构建所有端
 * @param {*} media  dev or build ...
 * @param {*} type  wx web weex
 */
exports.startReleaseAll = async function (media) {
  let allPlatform = cml.config.get().platforms;
  let offPlatform = [];
  let activePlatform = []; // 启动编译的platform
  if (media === 'dev') {
    offPlatform = cml.config.get().devOffPlatform;
  } else if (media === 'build') {
    offPlatform = cml.config.get().buildOffPlatform;
  }
  // 获取激活平台
  for (let i = 0, j = allPlatform.length; i < j; i++) {
    let platform = allPlatform[i];
    if (!~offPlatform.indexOf(platform)) {
      activePlatform.push(platform)
    }
  }

  // 是否编译web端
  let isCompile = !!~activePlatform.indexOf('web');
  // 给preview使用
  cml.activePlatform = activePlatform;

  for (let i = 0, j = activePlatform.length; i < j; i++) {
    let platform = activePlatform[i];
    if (platform !== 'web') {
      await exports.getBuildPromise(media, platform);
    }
  }

  await exports.getWebBuildPromise(media, isCompile)
  startCmlLinter(media);
}

exports.startReleaseOne = async function(media, type) {
  // 给preview使用
  cml.activePlatform = [type];
  if (type === 'web') {
    await exports.getWebBuildPromise(media, true);
  } else {
    let build = exports.getBuildPromise(media, type);
    // 如果dev模式再启动web服务
    if (media === 'dev') {
      await build.then(res => {
        exports.getWebBuildPromise(media, false);
      })
    }
  }
  startCmlLinter(media);

}

// let lastLintTime = null;
function startCmlLinter(media) {
  if (cml.config.get().enableLinter === true && media === 'dev') {
    cmlLinter(cml.projectRoot);

    const watcher = watch([cml.projectRoot + '/src/**/**.**']);
    watcher.on('change', function(path, stat) {
      cmlLinter(cml.projectRoot);
    });
  }
}
