const _ = module.exports = {};
const platform = process.env.platform;

_.webPx2Cpx = function(px) {
  function getViewportSize() {
    let viewportWidth;
    let viewportHeight;
    if (window.innerWidth) {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth) {
      viewportWidth = document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
      viewportHeight = document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
    }
    return {
      viewportWidth: viewportWidth,
      viewportHeight: viewportHeight
    };
  }
  const {viewportWidth} = getViewportSize();
  const cpx = +(750 / viewportWidth * px).toFixed(3);
  return cpx;
}
_.miniappPx2Cpx = function(px, platform) {
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

  const viewportWidth = getViewportSize();
  const cpx = +(750 / viewportWidth * px).toFixed(3);
  return cpx;
}
_.px2cpx = function(px) {
  if (platform === 'web') {
    return _.webPx2Cpx(px);
  }
  if (['wx', 'baidu', 'alipay'].includes(platform)) {
    return _.miniappPx2Cpx(px, platform);
  }
}
