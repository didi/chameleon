/* eslint-disable */
var websocket = weex.requireModule('webSocket')

class WeexWebSocket {
  constructor(url, protocal) {
    this.instance = weex.requireModule('webSocket');
    this.init(url, protocal);
    this.env = WXEnvironment.platform.toUpperCase()
  }

  init(url, protocal) {
    this.instance.WebSocket(url, protocal)
  }

  onopen(cb) {

    this._adapter('onopen', cb);
  }

  onmessage(cb) {
    this._adapter('onmessage', cb);
  }

  onerror(cb) {
    this._adapter('onerror', cb);
  }

  onclose(cb) {
    this._adapter('onclose', cb);
  }

  send(...args) {
    return this.instance.send(...args);
  }

  close(...args) {
    return this.instance.close(...args);
  }

  _adapter(key, cb) {
    if (this.env === "ANDROID") {
      this.instance[key](cb);

    } else if (this.env === 'IOS') {
      this.instance[key] = cb;
    }
  }

}

module.exports = WeexWebSocket;
