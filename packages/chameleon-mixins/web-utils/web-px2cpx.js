const _ = module.exports = {};

_.px2cpx = function(px) {
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
