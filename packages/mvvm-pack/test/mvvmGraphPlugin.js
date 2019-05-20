
var mvvmGraphPlugin = require('../mvvmGraphPlugin.js')
var demoPlugin = require('./demoPlugin.js');
const expect = require('chai').expect;
const EventEmitter = require('events');

describe('cmlNode', function() {
  it('constructor', function() {
    var oldCml;
    if (global.cml) {
      oldCml = global.cml;
    }

    global.cml = {
      event: new EventEmitter()
    };

    let options = {
      cmlType: 'wx',
      media: 'dev'
    }
    let demoPluginInstance = new demoPlugin(options);

    let pluginInstance = new mvvmGraphPlugin(options, demoPluginInstance);


    let runcb;
    let webpackCompiler = {
      plugin: function(key, func) {
        runcb = func
      },
      run: function() {
        let compilation = {
          modules: [{
            _nodeType: 'app'
          }]
        }
        runcb(compilation)
      }
    }

    pluginInstance.apply(webpackCompiler);

    // 执行
    webpackCompiler.run();

    global.cml = oldCml;
  })
})
