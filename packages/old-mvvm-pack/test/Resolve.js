
const path = require('path')
const ResolveFactory = require('../lib/ResolveFactory.js')

let resolve = ResolveFactory({
  config: {},
  cmlRoot: path.resolve('../'),
  projectRoot: path.join('../')
});

resolve.resolve({}, '/Users/didi/Documents/newcml/open/mvvm-sets/test_project/src/app/', '../router.config.json?__inline', {}, function(err, result) {
  if (err) {
    throw err;
  }
  console.log(path.extname(result))
  // expect(result).to.equal(path.join(__dirname,'../src/Event.js'))
})
