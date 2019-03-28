
const ResolveFactory = require('../lib/ResolveFactory.js')
let expect = require('chai').expect;
const path = require('path');

describe('ResolveFactory', function() {
  it('getResolveObject', function() {
    let result = ResolveFactory({
      config: {},
      cmlRoot: path.resolve('../'),
      projectRoot: path.join('../')
    });
    expect(typeof result).to.equal('object')
  })

  it('resolve Relative Path', function() {
    let resolve = ResolveFactory({
      config: {},
      cmlRoot: path.resolve('../'),
      projectRoot: path.join('../')
    });

    resolve.resolve({}, path.join(__dirname), '../src/Event', {}, function(err, result) {
      if (err) {
        throw err;
      }
      console.log(result)
      expect(result).to.equal(path.join(__dirname,'../src/Event.js'))
    })
  })

})