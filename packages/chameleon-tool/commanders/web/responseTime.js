module.exports = function () {
  return function (req, res, next) {
    if (~req.originalUrl.indexOf('__webpack')) {
      cml.log.debug(req.originalUrl + ': start')
    }
    req._startTime = new Date() // 获取时间 t1

    var calResponseTime = function () {
      var now = new Date(); // 获取时间 t2
      var deltaTime = now - req._startTime;
      cml.log.debug(req.originalUrl + ':' + deltaTime + 'ms');
    }

    res.once('finish', calResponseTime);
    res.once('close', calResponseTime);
    return next();
  }
}
