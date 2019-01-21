var _ = require('../src/index.js');
var expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

const cmlFileContent = fs.readFileSync(path.resolve(__dirname, './testlib/index.cml'), {
  encoding: 'utf-8'
});
const interfaceFileContent = fs.readFileSync(path.resolve(__dirname, './testlib/index.interface'), {
  encoding: 'utf-8'
});

let cmlplatforms = ['wx', 'weex', 'baidu', 'alipay', 'web'];
let miniplatform = [{
  key: 'wx',
  name: 'wxml'
},
{
  key: 'alipay',
  name: 'axml'
},
{
  key: 'baidu',
  name: 'swan'
}
]

describe('index.js', function () {
  it('is Object', function () {
    let result = _.is({}, 'Object')
    expect(result).to.be.equal(true);
  })
  it('is Array', function () {
    let result = _.is([], 'Array')
    expect(result).to.be.equal(true);
  })
  it('is String', function () {
    let result = _.is('', 'String')
    expect(result).to.be.equal(true);
  })
  it('is Cli', function () {
    let originCml = global.cml;
    delete global.cml;
    let result = _.isCli();
    expect(result).to.be.equal(false);
    global.cml = {};
    _.setCli(true);
    result = _.isCli();
    expect(result).to.be.equal(true);
    global.cml = originCml;
  })

  it('map', function () {
    var obj = {
      a: 1,
      b: {
        c: 2
      }
    };
    _.map(obj, function (key, value) {
      switch (key) {
        case 'a':
          expect(value).to.equal(1);
          break;
        case 'b':
          expect(value).to.deep.equal({
            c: 2
          });
          break;
        default:
          expect(true).to.equal(false);
      }
    });
  });
  it('merge', function () {
    var obj = {
      a: 1,
      b: {
        c: 2
      }
    };
    var ret = {
      b: {
        d: 3
      },
      e: 'abc'
    };
    _.map(obj, ret, true);
    expect(ret).to.deep.equal({
      a: 1,
      b: {
        c: 2
      },
      e: 'abc'
    });
  });

  it('setBuiltinNpmName', function () {
    let result = _.setBuiltinNpmName('cml-ui')
    expect(result).to.be.equal('cml-ui');
  })
  it('isDir', function () {
    let result = _.isDir(__dirname)
    expect(result).to.be.equal(true);
  })

  it('escapeShellArg', function () {
    let result = _.escapeShellArg('name')
    expect(result).to.be.equal('"name"');
  })

  it('isWin', function () {
    let result = _.isWin()
    expect(result).to.be.equal(process.platform.indexOf('win') === 0);
  })

  it('isFile true', function () {
    let result = _.isFile(path.join(__dirname, "index.test.js"))
    expect(result).to.be.equal(true);
  })

  it('isFile false', function () {
    let result = _.isFile(path.join(__dirname))
    expect(result).to.be.equal(false);
  })

  it('isDirectory false', function () {
    let result = _.isDirectory(path.join(__dirname, "index.test.js"))
    expect(result).to.be.equal(false);
  })

  it('isDirectory true', function () {
    let result = _.isDirectory(path.join(__dirname))
    expect(result).to.be.equal(true);
  })


  cmlplatforms.forEach(cmlType => {
    it(`getJsonFileContent cml文件 ${cmlType}`, function () {
      global.cml = {};
      _.setCli(false);
      let result = _.getJsonFileContent(path.join(__dirname, `./testlib/index.cml`), cmlType);
      expect(result).to.have.property('usingComponents');
      expect(result).to.have.property(`attr${cmlType}`);
    })
  })


  miniplatform.forEach(item => {
    it(`getJsonFileContent ${item.key}  ${item.name}`, function () {
      global.cml = {};
      _.setCli(false);
      let result = _.getJsonFileContent(path.join(__dirname, `./testlib/${item.key}/${item.key}.${item.name}`), item.key);
      expect(result).to.have.property('name');
    })
  })

  it('splitParts', function () {
    let result = _.splitParts({
      content: cmlFileContent
    });
    debugger
    expect(result.template.length).to.equal(1);
    expect(result.script.length).to.equal(2);
    expect(result.style.length).to.equal(1);
  })

  cmlplatforms.forEach(cmlType => {
    it(`getScriptPart ${cmlType}`, function () {
      let result = _.getScriptPart({
        content: interfaceFileContent,
        cmlType
      }).content;
      result = result.indexOf(cmlType);
      expect(result).to.not.equal(-1);
    })
  })

  cmlplatforms.forEach(cmlType => {
    it(`getScriptContent ${cmlType}`, function () {
      let result = _.getScriptContent({
        content: interfaceFileContent,
        cmlType
      });
      result = result.indexOf(cmlType);
      expect(result).to.not.equal(-1);
    })
  })

  cmlplatforms.forEach(cmlType => {
    it(`deleteScript ${cmlType}`, function () {
      let result = _.deleteScript({
        content: interfaceFileContent,
        cmlType
      });
      result = result.indexOf(cmlType);
      expect(result).to.equal(-1);
    })
  })

  it(`getNpmComponents not cli`, function () {
    global.cml = {};
    _.setCli(false);
    let result = _.getNpmComponents();
    expect(_.is(result, 'Array')).to.equal(true);

  })

  it(`getNpmComponents cli`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })
    // let result = _.getNpmComponents('wx', cml.projectRoot);
    // expect(result.length).to.equal(1);
  })

  it(`getBuildinComponents`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');

    // let result = _.getBuildinComponents('wx', cml.projectRoot);
    // expect(result.components.length).to.equal(1);
    // expect(Object.keys(result.compileTagMap).length).to.equal(1);
  })

  it(`getTargetInsertComponents`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })
    // let result = _.getTargetInsertComponents(__dirname, 'wx', cml.projectRoot);
    // expect(result.length).to.equal(2);
  })

  it(`isBuildIn  isBuildInProject: true`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      isBuildInProject: true
    })

    let result = _.isBuildIn();
    expect(result).to.equal(true);
  })

  it(`isBuildIn   buildinpath`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      isBuildInProject: false
    })
    let result = _.isBuildIn('/Users/didi/Documents/cml/chameleon-cli-utils/test/testlib/demo-project/node_modules/cml-ui/components/picker/picker.cml');
    expect(result).to.equal(true);
  })

  it(`addNpmComponents`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })
    let obj = {};
    // _.addNpmComponents(obj, __dirname, 'wx', cml.projectRoot);


    // expect(Object.keys(obj.usingComponents).length).to.equal(2);
  })

  it(`getOnePackageComponents`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })
    // let result = _.getOnePackageComponents('cml-ui', '/Users/didi/Documents/cml/chameleon-cli-utils/test/testlib/demo-project/node_modules/cml-ui/package.json', 'wx', cml.projectRoot);
    // expect(result.length).to.equal(1);
  })

  it(`handleComponentUrl`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })

    miniplatform.forEach(item => {
      let params = [
        cml.projectRoot,
        path.join(cml.projectRoot, 'index.cml'),
        `../${item.key}/${item.key}`,
        item.key
      ]

      let result = _.handleComponentUrl(...params);
      expect(result.filePath).to.equal(path.join(__dirname, `./testlib/${item.key}/${item.key}.${item.name}`));
    })
  })

  it('lintHandleComponentUrl', function() {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })

    miniplatform.forEach(item => {
      let params = [
        cml.projectRoot,
        path.join(cml.projectRoot, 'index.cml'),
        `../${item.key}/${item.key}`,
      ]

      let result = _.lintHandleComponentUrl(...params);
      expect(result.filePath).to.equal(path.join(__dirname, `./testlib/${item.key}/${item.key}.${item.name}`));
      expect(result.isCml).to.equal(undefined);
    })
  })


  it('lintHandleComponentUrl isCml true', function() {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })
    var cmlFilePath = path.join(__dirname, 'testlib/demo-project/index.cml');
    var comrefPath = './com2/com2'


    let result = _.lintHandleComponentUrl(cml.projectRoot, cmlFilePath, comrefPath);
    expect(result.filePath).to.equal(path.join(__dirname, `testlib/demo-project/com2/com2.cml`));
    expect(result.isCml).to.equal(true);
  })

  it('findInterfaceFile', function() {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })

    var cmlFilePath = path.join(__dirname, 'testlib/demo-project/index.cml');
    var comrefPath = './com1/com1'
    let result = _.findInterfaceFile(cml.projectRoot, cmlFilePath, comrefPath);
    expect(result.filePath).to.equal(path.join(__dirname, `testlib/demo-project/com1/com1.interface`));
  })


  it(`findComponent true`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })

    miniplatform.forEach(item => {
      let result = _.findComponent(path.join(__dirname, `./testlib/${item.key}/${item.key}`), item.key);
      expect(result).to.equal(path.join(__dirname, `./testlib/${item.key}/${item.key}.${item.name}`));
    })

  })

  it(`findComponent false`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })

    let result = _.findComponent(__dirname, 'wx');
    expect(result).to.equal(false);

  })

  it(`convertToRelativeRef`, function () {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    cml.config.merge({
      cmlComponents: ['cml-ui']
    })

    let result = _.findComponent(__dirname, 'wx');
    expect(result).to.equal(false);

  })

  it('getDevServerPath', function() {
    process.env.HOME = __dirname;
    let devpath = cml.utils.getDevServerPath();
    expect(devpath).to.be.equal(path.join(__dirname, '.chameleon/www'))
  })

  it('handleRelativePath same level', function() {
    let sourcePath = 'C:/src/compoents/a/a.cml';
    let targetPath = 'C:/src/compoents/a/b.cml';
    let relativePath = _.handleRelativePath(sourcePath, targetPath);
    expect(relativePath).to.be.equal('./b.cml')
  })

  it('handleRelativePath diff level1', function() {
    let sourcePath = 'C:/src/compoents/a/b/a.cml';
    let targetPath = 'C:/src/compoents/a/b.cml';
    let relativePath = _.handleRelativePath(sourcePath, targetPath);
    expect(relativePath).to.be.equal('./../b.cml')
  })

  it('handleRelativePath diff level1', function() {
    let sourcePath = 'C:/src/compoents/a/c.cml';
    let targetPath = 'C:/src/compoents/a/b/a.cml';
    let relativePath = _.handleRelativePath(sourcePath, targetPath);
    expect(relativePath).to.be.equal('./b/a.cml')
  })


  it('getCmlFileType', function() {
    global.cml = {};
    _.setCli(true);
    cml.config = require('./testlib/cli/config.js');
    cml.utils = require('../src/index.js');
    cml.projectRoot = path.join(__dirname, 'testlib/demo-project');
    let page1 = path.join(__dirname, './testlib/demo-project/src/pages/page1/page1.cml')
    let com1 = path.join(__dirname, './testlib/demo-project/src/components/com1/com1.cml')
    let app = path.join(__dirname, './testlib/demo-project/src/app/app.cml')
    let result1 = cml.utils.getCmlFileType(page1, cml.projectRoot, 'wx')
    let result2 = cml.utils.getCmlFileType(com1, cml.projectRoot, 'wx')
    let result3 = cml.utils.getCmlFileType(app, cml.projectRoot, 'wx')
    expect(result1).to.be.equal('page')
    expect(result2).to.be.equal('component')
    expect(result3).to.be.equal('app')

  })

  it('npmRefPathToRelative', function() {
    let context = path.join(__dirname, './testlib/demo-project');
    let npmRef = '/npm/cml-ui/button/button';
    let notNpmRef = './npm/cml-ui';

    let file1 = path.join(context, 'src/pages/page1/page1.cml') // ./../../npm
    let file2 = path.join(context, 'src/pages/page1.cml') // ./../npm
    let file3 = path.join(context, 'src/pages.cml') // ./npm

    let result1 = _.npmRefPathToRelative(npmRef, file1, context);
    let result2 = _.npmRefPathToRelative(npmRef, file2, context);
    let result3 = _.npmRefPathToRelative(npmRef, file3, context);
    let result4 = _.npmRefPathToRelative(notNpmRef, file3, context);
    expect(result1).to.be.equal('./../../npm/cml-ui/button/button');
    expect(result2).to.be.equal('./../npm/cml-ui/button/button');
    expect(result3).to.be.equal('./npm/cml-ui/button/button');
    expect(result4).to.be.equal(notNpmRef);



  })
})
