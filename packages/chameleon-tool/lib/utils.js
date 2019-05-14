const path = require('path');

const fse = require('fs-extra');
const watch = require('node-watch');
var opn = require('opn');
const utils = require('chameleon-tool-utils');
// 创建路由文件
// platform   web端和weex端 现在没有用到，如果要区分，cml weex dev命令要执行两遍， web和weex的要生成两个不同的routerOptions文件
// media dev模式开启watch  其他情况不监听变化 否则命名行不结束
utils.createRouterFile = function (platform, media) {

  let routerConfigPath = path.join(cml.projectRoot, 'src/router.config.json');

  if (utils.isFile(routerConfigPath)) {
    if (media === 'dev') {
      watch(routerConfigPath, { recursive: true }, function(evt, name) {
        cml.log.debug(' createRouterFile routerchange')
        cml.event.emit('routerchange')
      });
    }
  } else {
    cml.log.error('未找到路由配置文件');
  }

}

var TEMP_ROOT;

utils.getTempRoot = function () {
  if (!TEMP_ROOT) {
    var tmp = path.join(cml.projectRoot, 'node_modules/.chameleon')
    if (cml.config.get().serverPath) {
      tmp = cml.config.get().serverPath
    }
    utils.setTempRoot(tmp);
  }
  return TEMP_ROOT;
};

utils.getDevServerPath = function () {
  return path.resolve(utils.getTempRoot() + '/www');
}


utils.setTempRoot = function (tmp) {
  try {
    TEMP_ROOT = tmp;
    fse.ensureDirSync(tmp);
  } catch (e) {
    console.log(e);
  }
};


(function() {
  let previewUrl = '';
  // 设置打开预览页面Url
  utils.setPreviewUrl = function(url) {
    previewUrl = url;
  }
  utils.openPreviewUrl = function() {
    cml.log.notice('Listening at ' + previewUrl);
    if (cml.config.get().autoOpenPreview) {
      opn(previewUrl);
    }
  }
})();
// 生成config.json文件
module.exports = utils;

