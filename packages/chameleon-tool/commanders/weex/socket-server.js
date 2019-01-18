var WebSocketServer = require('ws').Server;
var utils = require('../../configs/utils.js');

// 连接池
var clients = [];

function broadcast(message) {
  clients.forEach(function(ws1) {
    cml.log.debug('[weex liveload send] ' + message)
    try {
      ws1.send(message);
    } catch (e) {
      cml.log.debug('[weex liveload] broadcast err')
      let index = clients.indexOf(ws1);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    }
  })
}


function startServer (options) {
  var port = utils.getFreePort().weexLiveLoadPort;
  var wss = new WebSocketServer({port: port});
  cml.log.debug('start weex liveload at port:' + port);
  wss.on('connection', function(ws) {
    cml.log.debug('[weex liveload] connection')
    // 将该连接加入连接池
    clients.push(ws);
    ws.on('message', function(message) {
      cml.log.debug('[weex liveload] message');
      cml.log.debug(message);
    });

    ws.on('close', function(message) {
      cml.log.debug('[weex liveload] close');

      // 连接关闭时，将其移出连接池
      clients = clients.filter(function(ws1) {
        return ws1 !== ws
      })
    });
  });
}

module.exports = {
  startServer,
  broadcast
}
