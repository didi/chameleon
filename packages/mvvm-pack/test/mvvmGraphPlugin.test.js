
var mvvmGraphPlugin = require('../mvvmGraphPlugin.js')
var demoPlugin = require('./demoPlugin.js');
const expect = require('chai').expect;
const EventEmitter = require('events');
const path = require('path');
const cmlUtils = require('chameleon-tool-utils');
describe('mvvmGraphPlugin.js', function() {
  it('1', function() {
    var oldCml;
    if (global.cml) {
      oldCml = global.cml;
    }

    global.cml = {
      event: new EventEmitter(),
      config: {
        get() {
          return {
            wx: {}
          }
        }
      }
    };

    let options = {
      cmlType: 'wx',
      media: 'dev'
    }
    let demoPluginInstance = new demoPlugin(options);

    let pluginInstance = new mvvmGraphPlugin(options, demoPluginInstance);


    let runcb;
    let webpackCompiler = {
      options: {
        output: {
          path: ''
        }
      },
      plugin: function(key, func) {
        runcb = func
      },
      run: function() {
        let compilation = {
          modules: [{
            _nodeType: 'app',
            _cmlSource: '',
            dependencies: [],
            request: 'request',
            resource: 'resource',
            rawRequest: 'rawRequest',
            id: 'id'

          }]
        }
        runcb(compilation)
      }
    }

    pluginInstance.apply(webpackCompiler);

    // 执行
    webpackCompiler.run();
    let result = {
      cmlType: 'wx',
      filePath: path.join(__dirname, 'test')
    };
    cml.utils = cmlUtils;
    cml.event.emit('find-component', result);
    var configJson = {};
    cml.event.emit('config-json', configJson);
    expect(result.extPath).to.be.equal(path.join(__dirname, 'test.wxml'));
    expect(configJson.name).to.be.equal('chameleon');
    global.cml = oldCml;

  })

  it('2', function() {
    var oldCml;
    if (global.cml) {
      oldCml = global.cml;
    }

    global.cml = {
      event: new EventEmitter(),
      config: {
        get() {
          return {
            wx: {
              
            }
          }
        }
      },
      log: cmlUtils.log
    };

    let options = {
      cmlType: 'wx',
      media: 'dev'
    }
    let demoPluginInstance = new demoPlugin(options);

    let pluginInstance = new mvvmGraphPlugin(options, demoPluginInstance);


    let runcb;
    let webpackCompiler = {
      options: {
        output: {
          path: ''
        }
      },
      plugin: function(key, func) {
        runcb = func
      },
      run: function() {
        let compilation = {
          modules: []
        }
        runcb(compilation)
      }
    }

    pluginInstance.apply(webpackCompiler);
    try {
      // 执行
      webpackCompiler.run();
    } catch (e) {
      expect(!!~e.message.indexOf('not find app.cml node')).to.be.equal(true)
    }

    global.cml = oldCml;

  })

  it('compiler.js', function() {
    var oldCml;
    if (global.cml) {
      oldCml = global.cml;
    }

    global.cml = {
      event: new EventEmitter(),
      config: {
        get() {
          return {
            wx: {
              dev: {
                minimize: true,
                hash: true
              }
            }
          }
        }
      }
    };

    let options = {
      cmlType: 'wx',
      media: 'dev'
    }
    let demoPluginInstance = new demoPlugin(options);

    let pluginInstance = new mvvmGraphPlugin(options, demoPluginInstance);


    let runcb;
    let webpackCompiler = {
      options: {
        output: {
          path: ''
        }
      },
      plugin: function(key, func) {
        runcb = func
      },
      run: function() {

        let page1module = {
          _nodeType: 'page',
          _bufferSource: '123',
          _outputPath: 'static/img.png',
          _cmlSource: '',
          dependencies: [],
          _publicPath: 'static.chameleon.com',
          request: 'request',
          resource: '/pages/page1.cml',
          rawRequest: 'rawRequest',
          id: 'id'
        }
        let page2module = {
          _nodeType: 'page',
          _bufferSource: '123',
          _outputPath: 'static/img.png',
          _cmlSource: '',
          dependencies: [],
          _publicPath: 'static.chameleon.com',
          request: 'request',
          resource: '/pages/page2.cml',
          rawRequest: 'rawRequest',
          id: 'id'
        }

        let assetModule = {
          _nodeType: 'module',
          _moduleType: 'asset',
          _bufferSource: '123',
          _outputPath: 'static/img.png',
          _cmlSource: '',
          dependencies: [],
          _publicPath: 'static.chameleon.com',
          request: 'request',
          resource: '/assets/chameleon.png',
          rawRequest: 'rawRequest',
          id: 'id'
        }

        let styleModule = {
          _nodeType: 'module',
          _moduleType: 'style',
          _cmlSource: '__cml/assets/chameleon.png__lmc;',
          dependencies: [],
          request: 'request',
          resource: 'resource',
          rawRequest: 'rawRequest',
          id: 'id'
        }

        let style2Module = {
          _source: {
            _value: '__cml/assets/chameleon.png__lmc;'
          },
          _cmlOriginSource: 'originsource',
          dependencies: [],
          request: 'request',
          resource: 'resource.css',
          rawRequest: 'rawRequest',
          id: 'id'
        }

        let templateModule = {
          _source: {
            _value: `<view></view>`
          },
          _moduleType: 'template',
          dependencies: [],
          request: 'request',
          resource: 'resource.cml',
          rawRequest: 'rawRequest',
          id: 'id'
        }

        let json1Module = {
          _source: {
            _value: `{"a":"a"}`
          },
          _moduleType: 'json',
          dependencies: [],
          request: 'request',
          resource: 'resource.cml',
          rawRequest: 'rawRequest',
          id: 'id'
        }
        let json2Module = {
          _source: {
            _value: `module.exports = {a}`
          },
          _moduleType: 'json',
          dependencies: [],
          request: 'request',
          resource: 'resource.cml',
          rawRequest: 'rawRequest',
          id: 'id'
        }

        let scriptModule = {
          _source: {
            _value: `module.exports = {}`
          },
          _moduleType: 'script',
          dependencies: [],
          request: 'request',
          resource: 'resource.js',
          rawRequest: 'rawRequest',
          id: 'id'
        }

        let compilation = {
          modules: [{
            _nodeType: 'app',
            _cmlSource: '',
            dependencies: [{
              module: page1module
            }, {
              module: page1module
            }, {
              module: page2module
            },
            {
              module: page2module
            },
            {
              module: assetModule
            },
            {
              module: styleModule
            },
            {
              module: style2Module
            },
            {
              module: templateModule
            },
            {
              module: json1Module
            },
            {
              module: json2Module
            },
            {
              module: scriptModule
            }],
            request: 'request',
            resource: '/pages/page1.cml',
            rawRequest: 'rawRequest',
            id: 'id'

          },
          assetModule,
          styleModule,
          style2Module]
        }
        runcb(compilation)
      }
    }

    pluginInstance.apply(webpackCompiler);
    cml.utils = cmlUtils;

    // 执行
    webpackCompiler.run();
    cmlUtils.fse.removeSync(path.join(webpackCompiler.options.output.path, 'static'))
    global.cml = oldCml;

  })
})
