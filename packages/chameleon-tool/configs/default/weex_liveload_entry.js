
import bridge from 'chameleon-bridge';

let wsAddr = `ws://${process.env.serverIp}:${process.env.liveloadPort}`
var modal = weex.requireModule('modal')

let socketInstance = bridge.initSocket({url: wsAddr});

socketInstance.onopen(function (e) {
})

socketInstance.onmessage(function (e) {
  if (e.data === 'weex_refresh') {
    bridge.reload()
  }
})
socketInstance.onerror(function (e) {

})
socketInstance.onclose(function (e) {

})
