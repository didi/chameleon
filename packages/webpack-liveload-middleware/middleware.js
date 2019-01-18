module.exports = webpackLiveLoadMiddleware;

var helpers = require('./helpers');
var pathMatch = helpers.pathMatch;

function webpackLiveLoadMiddleware(compiler, opts) {
  opts = opts || {};
  opts.log = typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log;
  opts.path = opts.path || '/__webpack_liveload';
  opts.heartbeat = opts.heartbeat || 10 * 1000;

  var eventStream = createEventStream(opts.heartbeat);
  var latestStats = null;

  if (compiler.hooks) {
    compiler.hooks.invalid.tap("webpack-liveload-middleware", onInvalid);
    compiler.hooks.done.tap("webpack-liveload-middleware", onDone);
  } else {
    compiler.plugin("invalid", onInvalid);
    compiler.plugin("done", onDone);
  }
  function onInvalid() {
    latestStats = null;
    eventStream.publish({action: "building"});
  }
  function onDone(statsResult) {
    // Keep hold of latest stats so they can be propagated to new clients
    latestStats = statsResult;
    eventStream.publish({action: "reload"});
  }
  var middleware = function(req, res, next) {
    if (!pathMatch(req.url, opts.path)) {return next();}
    eventStream.handler(req, res);
    if (latestStats) {
      // the server
      // eventStream.publish({action: "reload"});
    }
  };
  middleware.publish = eventStream.publish;
  return middleware;
}

function createEventStream(heartbeat) {
  var clientId = 0;
  var clients = {};
  function everyClient(fn) {
    Object.keys(clients).forEach(function(id) {
      fn(clients[id]);
    });
  }
  setInterval(function heartbeatTick() {
    everyClient(function(client) {
      client.write("data: \uD83D\uDC93\n\n");
    });
  }, heartbeat).unref();
  return {
    handler: function(req, res) {
      req.socket.setKeepAlive(true);
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        // While behind nginx, event stream should not be buffered:
        // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
        'X-Accel-Buffering': 'no'
      });
      res.write('\n');
      var id = clientId++;
      clients[id] = res;
      req.on("close", function() {
        delete clients[id];
      });
    },
    publish: function(payload) {
      everyClient(function(client) {
        client.write("data: " + JSON.stringify(payload) + "\n\n");
      });
    }
  };
}

