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
    if (outputpath) {
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
  if (!~['web','weex','alipay','baidu','wx'].indexOf(type)) {
    return {
      type: type,
      media,
      root: cml.projectRoot
    };
  }
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
  if (media === 'build') {
    process.env.NODE_ENV = 'production';
  }
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
  };
  // 获取weex jsbundle地址
  let weexjs = configObj.weexjs || '';

  let config = cml.config.get();
  config.buildInfo = config.buildInfo || {};
  let {wxAppId = '', baiduAppId = '', alipayAppId = '' } = config.buildInfo;
  let {routerConfig, hasError} = cml.utils.getRouterConfig();
  if (hasError) {
    throw new Error('router.config.json格式不正确')
  }

  let result = [];
  if (routerConfig) {
    if (!routerConfig.domain) {
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
      subProject.forEach(function(npmName) {
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
      if (!~cml.activePlatform.indexOf(key)) {
        delete item[key]
      }
    })
  })

  fse.outputFileSync(configJsonPath, JSON.stringify(result, '', 4))
}
