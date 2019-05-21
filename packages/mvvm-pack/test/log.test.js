
var Log = require('../log.js')

describe('log', function() {
  it('log.js', function() {
    let log = new Log();
    log.debug('debug')
    log.notice('notice')
    log.warn('warn')
    log.error('error')
  })
})
