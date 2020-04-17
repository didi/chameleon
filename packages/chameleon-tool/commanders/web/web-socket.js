var WebSocketServer = require('ws').Server;
// 连接池
var clients = [];
var staticParams = {};

exports.broadcast = function broadcast(message) {
  clients.forEach(function(ws1) {
    cml.log.debug('[web liveload send] ' + message)
    try {
      ws1.send(message);
    } catch (e) {
      cml.log.debug('[web liveload] broadcast err')
      let index = clients.indexOf(ws1);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    }
  })
}


exports.startServer = function startServer (options) {
  const server = options.server;
  var wss = new WebSocketServer({server});
  wss.on('connection', function(ws) {
    clients = [];
    clients.push(ws);
    exports.initRouter();
    ws.on('close', function(message) {
      cml.log.debug('[web liveload] close');
    });
  });
}
exports.initRouter = function initRouter() {
  let routeList = exports.getRouteConfig();
  exports.broadcast(routeList);
}
exports.getRouteConfig = function getRouteConfig() {
  let {routerConfig, hasError} = cml.utils.getRouterConfig();
  if (!hasError) {
    routerConfig.routes = routerConfig.routes.filter((item) => {
      let usedPlatforms = item.usedPlatforms;
      return (!usedPlatforms || (usedPlatforms && usedPlatforms.includes('web')) || (usedPlatforms && usedPlatforms.includes('weex')))
    })
    routerConfig = Object.assign(routerConfig, staticParams);// {jsbundle,subpath}
    return JSON.stringify(routerConfig);
  }
}
exports.createRoutesReact = function createRoutesReact(options) {
  staticParams = options.staticParams;
  exports.startServer(options);
  cml.event.removeAllListeners('routerchange');
  cml.event.on('routerchange', function() {
    let routeList = exports.getRouteConfig();
    if (routeList) {
      exports.broadcast(routeList)
    }
  })
}
