const webpack = require('webpack');
const devServer = require('./web/dev-server.js');
const getConfig = require('../configs/index.js');
const {startServer: startWeexLiveLoad, broadcast} = require('./weex/socket-server.js');
const previewSocket = require('./web/web-socket.js');
const cmlLinter = require('chameleon-linter');
const watch = require('glob-watcher');
const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cmlUtils = require('chameleon-tool-utils');

/**
 * 非web端构建
 * @param {*} media  dev or build ...
 * @param {*} type  wx web weex
 */
exports.getBuildPromise = async function (media, type) {

  let options = exports.getOptions(media, type);
  let webpackConfig = await getConfig(options);
  //  非web和weex 并且非增量
  if (!~['web', 'weex'].indexOf(type) && options.increase !== true) {
    // 异步删除output目录
    var outputpath = webpackConfig.output.path;
    if (outputpath) {
      await new Promise(function(resolve, reject) {
        fse.remove(outputpath, function(err) {
          if (err) {
            reject(err);
          }
          resolve();
        })
      })['catch'](e => {
        let message = `clear file error! please remove direction ${outputpath} by yourself!`
        cml.log.error(message);
        throw new Error(e)
      })
    }

  }
  return new Promise(function(resolve, reject) {
    // watch模式
    if (media === 'dev') {
      const compiler = webpack(webpackConfig);
      if (type === 'weex') {
        startWeexLiveLoad(options);
      }
      let optimizeCML = cml.config.get().optimize;
      let watchOptions = {
        aggregateTimeout: 300,
        poll: undefined
      }
      if (optimizeCML && !optimizeCML.watchNodeModules) {
        watchOptions.ignored = /node_modules/;
      }
      compiler.watch(watchOptions, (err, stats) => {

        if (type === 'weex') {
          if (!(stats && stats.compilation && stats.compilation.errors && stats.compilation.errors.length > 0)) {
            broadcast('weex_refresh');
          }
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
  let chameleonConfig = (cml.config.get() && cml.config.get()[type] && cml.config.get()[type][media]) || {};

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
    if (isCompile) {
      return exports.getBuildPromise(media, 'web');
    } else {
      return Promise.resolve();
    }
  }
}

/**
 * 构建所有端
 * @param {*} media  dev or build ...
 * @param {*} type  wx web weex
 */
exports.startReleaseAll = async function (media) {
  if (media === 'build') {
    process.env.NODE_ENV = 'production';
  }
  let cmlConfig = cml.config.get();
  let allPlatform = cmlConfig.platforms;
  let offPlatform = [];
  let activePlatform = []; // 启动编译的platform
  if (media === 'dev') {
    offPlatform = cmlConfig.devOffPlatform;
  } else if (media === 'build') {
    offPlatform = cmlConfig.buildOffPlatform;
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

  await exports.getWebBuildPromise(media, isCompile);
  if (media === 'build') {
    exports.createConfigJson()
  }
  startCmlLinter(media);
}

exports.startReleaseOne = async function(media, type) {
  if (media === 'build') {
    process.env.NODE_ENV = 'production';
  }
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
    } else {
      await build;
    }
  }
  if (media === 'build') {
    exports.createConfigJson()
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

exports.createConfigJson = function() {
  let configJsonPath = path.join(cml.projectRoot, 'dist/config.json');
  let configObj = {};
  if (cml.utils.isFile(configJsonPath)) {
    configObj = JSON.parse(fs.readFileSync(configJsonPath, {encoding: 'utf-8'}))
  }
  // 获取weex jsbundle地址
  let weexjs = configObj.weexjs || '';
  let md5str = '';
  const weexjsName = weexjs.split('/').pop();
  const weexjsPath = path.resolve(cml.projectRoot, 'dist/weex/', weexjsName);

  if (cml.utils.isFile(weexjsPath)) {
    const md5sum = crypto.createHash('md5');
    const buffer = fs.readFileSync(weexjsPath);
    md5sum.update(buffer);
    md5str = md5sum.digest('hex').toUpperCase();
  }

  let config = cml.config.get();
  config.buildInfo = config.buildInfo || {};
  let {wxAppId = '', baiduAppId = '', alipayAppId = '' } = config.buildInfo;
  let {routerConfig, hasError} = cml.utils.getRouterConfig();
  if (hasError) {
    throw new Error('router.config.json格式不正确')
  }

  let result = [];
  if (routerConfig) {
    if (~cml.activePlatform.indexOf('web') && !routerConfig.domain) {
      throw new Error('router.config.json 中未设置web端需要的domain字段');
    }
    let {domain, mode} = routerConfig;

    routerConfig.routes.forEach(item => {
      let webUrl = domain;
      if (mode === 'history') {
        webUrl += item.url;
      } else if (mode === 'hash') {
        webUrl += ('#' + item.url);
      }
      let route = {
        wx: {
          appId: wxAppId,
          path: item.path
        },
        baidu: {
          appId: baiduAppId,
          path: item.path
        },
        alipay: {
          appId: alipayAppId,
          path: item.path
        },
        web: {
          url: webUrl
        },
        weex: {
          url: weexjs,
          md5: md5str,
          query: {
            path: item.path
          }
        }
      }
      if (item.extra) {
        route.extra = item.extra;
      }
      result.push(route);
    })
    // 处理subProject配置的npm包中cml项目的页面
    let subProject = cml.config.get().subProject;
    if (subProject && subProject.length > 0) {
      subProject.forEach(function(item) {
        let npmName = cmlUtils.isString(item) ? item : item.npmName;
        let npmRouterConfig = cml.utils.readsubProjectRouterConfig(cml.projectRoot, npmName);
        npmRouterConfig.routes && npmRouterConfig.routes.forEach(item => {
          let cmlFilePath = path.join(cml.projectRoot, 'node_modules', npmName, 'src', item.path + '.cml');
          let routePath = cml.utils.getPureEntryName(cmlFilePath, '', cml.projectRoot);
          routePath = cml.utils.handleSpecialChar(routePath);
          let webUrl = domain;
          if (mode === 'history') {
            webUrl += item.url;
          } else if (mode === 'hash') {
            webUrl += ('#' + item.url);
          }
          if (routePath[0] !== '/') {
            routePath = '/' + routePath;
          }
          let route = {
            wx: {
              appId: wxAppId,
              path: routePath
            },
            baidu: {
              appId: baiduAppId,
              path: routePath
            },
            alipay: {
              appId: alipayAppId,
              path: routePath
            },
            web: {
              url: webUrl
            },
            weex: {
              url: weexjs,
              query: {
                path: routePath
              }
            }
          }
          result.push(route);
        })
      })
    }
  }

  result.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!~cml.activePlatform.indexOf(key) && key !== 'extra') {
        delete item[key]
      }
    })
  })

  cml.event.emit('config-json', result);
  /* eslint-disable-next-line */
  fse.outputFileSync(configJsonPath, JSON.stringify(result, '', 4))
}
