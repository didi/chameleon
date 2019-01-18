
process.argv = ['node', 'chameleon.js'];
require('../../lib/index.js');
var utils = require('../../configs/utils.js');
const _ = require('chameleon-tool-utils');
var expect = require('chai').expect;
const path = require('path');
const fse = require('fs-extra');


describe('configs utils.js', function () {
  it('getPostcssrcPath', function () {
    let platfrom = ['alipay', 'baidu', 'export', 'web', 'weex', 'wx'];
    platfrom.forEach(item => {
      expect(_.isFile(utils.getPostcssrcPath(item))).to.equal(true);
      expect(utils.getPostcssrcPath(item)).to.equal(path.join(__dirname, `../../configs/postcss/${item}/.postcssrc.js`));
    })
  })

  it('cssLoaders', function () {
    let options = {
      type: 'web'
    }
    let result = utils.cssLoaders(options);
    expect(result).to.have.property('css');
    expect(result).to.have.property('less');
    expect(result).to.have.property('js');
    expect(result).to.have.property('stylus');
    expect(result).to.have.property('styl');

  })


  it('styleLoaders', function () {
    let result = utils.styleLoaders();
    expect(_.is(result, 'Array')).to.equal(true);
  })

  it('getMiniAppEntry', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    let result = utils.getMiniAppEntry('wx');
    expect(result).to.have.property('app');
    expect(result).to.have.property('common');
  })

 

  it('getMiniAppEntry export', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'export';
    cml.config.merge({
      wx: {
        export: {
          entry: [
            './src'
          ]
        }
      }
    })
    let result = utils.getMiniAppEntry('wx');
    expect(result).to.have.property('common');
    expect(result).to.have.property('src/app/app');
    expect(result).to.have.property('src/pages/index/index');
  })

  it('getWebEntry', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'build';
    var {getOptions} = require('../../commanders/utils.js');
    let options = getOptions('build', 'web');
    let result = utils.getWebEntry(options);
    expect(Object.keys(result.entry).length > 0).to.equal(true);
    expect(result.htmlPlugins.length > 0).to.equal(true);
  })

  it('getWebExportEntry', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'build';
    cml.config.merge({
      web: {
        export: {
          entry: ['src']
        }
      }
    })
    var {getOptions} = require('../../commanders/utils.js');
    let options = getOptions('export', 'web');
    let result = utils.getWebExportEntry(options);
    expect(Object.keys(result.entry).length > 0).to.equal(true);
    expect(result.htmlPlugins.length === 0).to.equal(true);
  })

  it('getWeexEntry', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'build';
    cml.config.merge({
      projectName: 'test'
    })
    var {getOptions} = require('../../commanders/utils.js');
    let options = getOptions('build', 'weex');
    let result = utils.getWeexEntry(options);
    expect(result.test.length > 0).to.equal(true);
  })

  it('getWeexExportEntry', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'build';
    cml.config.merge({
      projectName: 'test'
    })
    var {getOptions} = require('../../commanders/utils.js');
    let options = getOptions('build', 'weex');
    let result = utils.getWeexEntry(options);
    expect(result.test.length > 0).to.equal(true);
  })

  it('getEntryName', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'build';
    cml.config.merge({
      projectName: 'test'
    })
    let result = utils.getEntryName();
    expect(result).to.equal('test');
  })

  it('getBabelPath', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'build';
    cml.config.merge({
      projectName: 'test'
    })
    let result = utils.getBabelPath();
    expect(!!~result.indexOf(path.join(cml.projectRoot, 'src'))).to.equal(true);
    expect(!!~result.indexOf(path.join(cml.projectRoot, '.temp'))).to.equal(true);
    expect(!!~result.indexOf(path.join(cml.root, 'configs'))).to.equal(true);
    expect(!!~result.indexOf(path.join(cml.projectRoot, 'node_modules'))).to.equal(true);
    expect(!!~result.indexOf(path.join(cml.root, 'node_modules'))).to.equal(true);
  })

  it('getGlobalCheckWhiteList', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'build';
    cml.config.merge({
      globalCheckWhiteList: [
        'test.min.js'
      ]
    })

    let result = utils.getGlobalCheckWhiteList();
    expect(!!~result.indexOf('node_modules/vuex/dist/vuex.esm.js')).to.equal(true);
    expect(!!~result.indexOf("commonlogin.min.js")).to.equal(true);
    expect(!!~result.indexOf('test.min.js')).to.equal(true);
  })

  it('copyDefaultFile', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    const tempDir = path.join(cml.projectRoot, '.temp')
    fse.removeSync(tempDir);
    utils.copyDefaultFile(cml.projectRoot, 'web', 'build');
    expect(_.isDirectory(tempDir)).to.equal(true);
    expect(_.isFile(path.join(tempDir, 'entry.html'))).to.equal(true);
    expect(_.isFile(path.join(tempDir, 'entry.web.js'))).to.equal(true);
    expect(_.isFile(path.join(tempDir, 'router.js'))).to.equal(true);
    expect(_.isFile(path.join(tempDir, 'routerOptions.js'))).to.equal(true);
  })

  it('setFreePort and getFreePort', function () {
    utils.setFreePort().then(res => {
      let result = utils.getFreePort();
      expect(typeof result.webServerPort).to.equal('number');
      expect(typeof result.weexLiveLoadPort).to.equal('number');
    })
  })

})
