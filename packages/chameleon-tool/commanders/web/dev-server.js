
var opn = require('opn')
var path = require('path')
var express = require('express')
var phpIndexMiddleWare = require('./php_cgi_middleware.js');
var utils = require('../../configs/utils.js');
var config = require('../../configs/config');
var dynamicApiMiddleware = require('./dynamicApiMiddleware');
var responseTime = require('./responseTime');
const liveLoadMiddleware = require('webpack-liveload-middleware');
const fse = require('fs-extra');
const tpl = require('chameleon-templates');
const proxy = require('chameleon-dev-proxy');
const url = require('url')
const {createRoutesReact} = require('./web-socket.js')
const http = require('http');
const bodyParser = require('body-parser')

/**
 * webpackConfig webpack的配置对象
 * options media的配置
 * compile  webpack编译对象 如果存在则证明是要编译web端
 *
 */
module.exports = function({webpackConfig, options, compiler}) {
  // 执行web之前先更新server模板
  updateServerTpl();

  var port = utils.getFreePort().webServerPort;
  var autoOpenBrowser = true;
  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.text({ type: 'text/html' }))
  app.use(responseTime());
  dynamicApiMiddleware(app, options);
  if (compiler) {

    if (options.hot === true) {
      var hotMiddleware = require('webpack-hot-middleware')(compiler, {
        heartbeat: 9000,
        noInfo: true,
        quiet: true,
        log: function() {
          // 禁止输出
        }
      })
      app.use(hotMiddleware)

    } else {
      app.use(liveLoadMiddleware(compiler))
    }
    if (cml.config.get().templateType === 'html') {
      // handle fallback for HTML5 history API
      app.use(require('connect-history-api-fallback')({
        index: `${utils.getEntryName()}.html`
      }))
    }
  }

  // serve pure static assets
  var staticPath = webpackConfig.output.path;
  app.use(express["static"](staticPath));
  let dist = path.join(cml.projectRoot, 'dist');
  app.use(express["static"](dist));

  if (compiler && cml.config.get().templateType === 'smarty') {
    // php-cgi
    app.use(phpIndexMiddleWare(staticPath));
  }

  var _resolve
  var readyPromise = new Promise(resolve => {
    _resolve = resolve
  })
  // 创建project.json文件
  fse.ensureFileSync(path.join(cml.utils.getDevServerPath(), 'json/project.json'))
  fse.writeJsonSync(path.join(cml.utils.getDevServerPath(), 'json/project.json'), {projectName: cml.config.get().projectName})
  if (compiler) {
    let first = true;
    compiler.watch({
      aggregateTimeout: 300,
      poll: undefined
    }, (err, stats) => {
      if (first) {
        startServer();
        first = false;
      }
      if (err) {
        throw err;
      }
    });

  } else {
    startServer();
  }

  function startServer() {
    fse.copySync(path.join(cml.root, 'configs/preview-assets'), path.join(cml.utils.getDevServerPath(), 'preview-assets'))

    // 保证webpack打包完再启动web服务，否则webpack打包卡住命令行无法关闭
    // app.listen(port)
    const server = http.createServer(app).listen(port);
    var uri = `http://${config.ip}:${port}/`;
    let subpath = '';
    // 未启动web端编译
    if (!compiler) {
      subpath = `web_empty.html`;
      fse.copyFileSync(path.join(cml.root, 'configs/web_empty.html'), path.join(cml.utils.getDevServerPath(), 'web_empty.html'))
    }
    uri += `preview.html`;
    var entry = utils.getEntryName();
    var jsbundle = `weex/${entry}.js`;
    let staticParams = { jsbundle, subpath, buildType: cml.activePlatform };
    createRoutesReact({server, staticParams});

    cml.log.notice('Listening at ' + uri);
    // when env is testing, don't need open it
    if (autoOpenBrowser) {
      opn(uri)
    }
    let proxyObj = cml.config.get().proxy || {};
    // 最后启动代理服务
    if (proxyObj.enable) {
      // 默认代理weex和web端的js和css文件
      let defaultMap = [{
        from: `/weex/${cml.config.get().projectName}_(.+).js`,
        to: `http://${config.ip}:${port}/weex/${cml.config.get().projectName}.js`
      }, {
        from: `/web/static/js/${cml.config.get().projectName}_(.+).js`,
        to: `http://${config.ip}:${port}/static/js/${cml.config.get().projectName}.js`
      }, {
        from: `/web/static/js/manifest_(.+).js`,
        to: `http://${config.ip}:${port}/static/js/manifest.js`
      }, {
        from: `/web/static/js/vender_(.+).js`,
        to: `http://${config.ip}:${port}/static/js/vender.js`
      }, {
        from: `/web/static/css/vender_(.+).css`,
        to: `http://${config.ip}:${port}/static/css/vender.css`
      }, {
        from: `/web/static/css/${cml.config.get().projectName}_(.+).css`,
        to: `http://${config.ip}:${port}/static/css/${cml.config.get().projectName}.css`
      }];
      // 启动代理服务
      proxy.createProxy({
        devServer: `http://${config.ip}:${port}/getkey/`,
        caCertPath: path.join(cml.utils.getDevServerPath(), 'getkey'),
        sslConnectInterceptor: (req, cltSocket, head) => true,
        requestInterceptor: (rOptions, req, res, ssl, next) => {
          var fullUrl = rOptions.protocol + '//' + rOptions.hostname + rOptions.path;
          var maplist = proxyObj.mapremote || [];
          maplist = defaultMap.concat(maplist);
          cml.log.notice(fullUrl + '\n');
          if (maplist) {
            maplist.forEach((item) => {
              if (new RegExp(item.from).test(fullUrl)) {
                var srcObj = url.parse(fullUrl);
                var desObj = url.parse(item.to);
                rOptions.host = desObj.host;
                rOptions.hostname = desObj.hostname;
                rOptions.port = desObj.port;
                rOptions.protocol = desObj.protocol;
                rOptions.path = desObj.pathname + '?' + (desObj.query || '') + '&' + (srcObj.query || '');
                rOptions.pathname = desObj.pathname;
                rOptions.agent = false;
              }
            });
          }
          next();
        }
      });
    }
    _resolve()
  }

  return readyPromise

}

function updateServerTpl() {
  let serverPath = cml.utils.getDevServerPath();
  let serverVersionFile = path.resolve(serverPath, '.server/server-tpl-verison.json');
  let tplVersion = require(tpl["package"]).version;
  if (cml.utils.isFile(serverVersionFile)) {
    let version = require(serverVersionFile).version;
    if (version === tplVersion) {
      return;
    }
  }
  fse.copySync(tpl.serverTpl, serverPath);
  fse.outputFileSync(serverVersionFile, `{"version": "${tplVersion}"}`);
}
