process.argv = ['node', 'chameleon.js'];

require('../../lib/index.js');

describe('log.js', function () {
  it('it should console debug', function () {
    let cli = require('../../lib/cli.js');
    cli.run();
  })

})
