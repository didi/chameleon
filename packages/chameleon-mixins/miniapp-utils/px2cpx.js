const _ = module.exports = {};
const platform = process.env.platform;
let viewportWidth ;
_.px2cpx = function(px) {
  function getViewportSize() {
    if (platform === 'wx') {
      const { windowWidth } = wx.getSystemInfoSync();
      return windowWidth;
    }
    if (platform === 'baidu') {
      const { windowWidth } = swan.getSystemInfoSync();
      return windowWidth;
    }
    if (platform === 'alipay') {
      const { windowWidth } = my.getSystemInfoSync();
      return windowWidth;
    }
  }

  viewportWidth = viewportWidth || getViewportSize();
  const cpx = +(750 / viewportWidth * px).toFixed(3);
  return cpx;
}
