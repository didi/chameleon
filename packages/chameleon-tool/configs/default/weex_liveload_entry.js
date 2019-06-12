
import bridge from 'chameleon-bridge';

let wsAddr = `ws://${process.env.serverIp}:${process.env.liveloadPort}`
var modal = weex.requireModule('modal')

let socketInstance = bridge.initSocket({url: wsAddr});

socketInstance.onopen(function (e) {
  modal.toast({
    message: 'onopen',
    duration: 0.3
  })
})

socketInstance.onmessage(function (e) {
  modal.toast({
    message: e.data,
    duration: 0.3
  })
  if (e.data === 'weex_refresh') {
    bridge.reload()
  }
})
socketInstance.onerror(function (e) {
  modal.toast({
    message: 'onerror',
    duration: 0.3
  })
})
socketInstance.onclose(function (e) {
  modal.toast({
    message: 'onclose',
    duration: 0.3
  })
})
