/* eslint-disable */

const WeexWebSocket = require('./WeexWebSocket.js');

let wsAddr = `ws://${process.env.serverIp}:${process.env.liveloadPort}`
let socketInstance = new WeexWebSocket(wsAddr, '');
const weexMod = weex.requireModule('weexMod');
var modal = weex.requireModule('modal')

socketInstance.onopen(function (e) {
})

socketInstance.onmessage(function (e) {

  if (e.data === 'weex_refresh') {
    weexMod.reloadPage('')
  }
})
socketInstance.onerror(function (e) {

})
socketInstance.onclose(function (e) {

})
