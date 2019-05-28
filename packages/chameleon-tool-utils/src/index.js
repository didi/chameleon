const fs = require('fs');
const path = require('path');
const pth = path;
const _exists = fs.existsSync || pth.existsSync;
const IS_WIN = process.platform.indexOf('win') === 0;
const glob = require('glob');
var TEMP_ROOT;
const fse = require('fs-extra');
const log = require('./log.js');
const cacheNumber = 100;
const cache = require('lru-cache')(cacheNumber);
const hash = require('hash-sum');
const splitParts = require('./lib/splitParts.js');
const childProcess = require('child_process');

var _ = module.exports = {}

_.log = log;

_.is = function (source, type) {
  return Object.prototype.toString.call(source) === '[object ' + type + ']';
};

// 还是放在全局 保证单例，可能cli与loader中的utils版本不一致会用不同的utils
_.isCli = function () {
  return !!(global.cml && global.cml.__ISCML__ === true);
}

_.setCli = function (flag) {
  global.cml.__ISCML__ = flag;
}

// 内置组件库名称
let builtinNpmName = 'chameleon-ui-builtin';

// 内置组件库可设置
_.setBuiltinNpmName = function(npmName) {
  builtinNpmName = npmName;
  return builtinNpmName;
}


/**
 * 对象枚举元素遍历，若merge为true则进行_.assign(obj, callback)，若为false则回调元素的key value index
 * @param  {Object}   obj      源对象
 * @param  {Function|Object} callback 回调函数|目标对象
 * @param  {Boolean}   merge    是否为对象赋值模式
 * @name map
 * @function
 */
_.map = function (obj, callback, merge) {
  var index = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (merge) {
        callback[key] = obj[key];
      } else if (callback(key, obj[key], index++)) {
        break;
      }
    }
  }
};

/**
 * 将target合并到source上，新值为undefiend一样会覆盖掉原有数据
 * @param  {Object} source 源对象
 * @param  {Object} target 目标对象
 * @return {Object}        合并后的对象
 * @name merge
 * @function
 */
_.merge = function (source, target) {
  if (_.is(source, 'Object') && _.is(target, 'Object')) {
    _.map(target, function (key, value) {
      source[key] = _.merge(source[key], value);
    });
  } else {
    source = target;
  }
  return source;
};

_.getTempRoot = function () {
  if (!TEMP_ROOT) {
    var list = ['CML_TEMP_DIR', 'HOME'];
    var tmp;
    for (var i = 0, len = list.length; i < len; i++) {
      if ((tmp = process.env[list[i]])) {
        break;
      }
    }
    tmp = tmp || __dirname + '/../';
    tmp = path.resolve(tmp + '/.chameleon');

    _.setTempRoot(tmp);
  }
  return TEMP_ROOT;
};

_.getDevServerPath = function () {
  return path.resolve(_.getTempRoot() + '/www');
}


_.setTempRoot = function (tmp) {
  try {
    TEMP_ROOT = tmp;
    fse.ensureDirSync(tmp);
  } catch (e) {
    console.log(e);
  }
};

/**
 * 判断文件是否存在。
 * @param {String} filepath 文件路径。
 * @name exist
 * @function
 */
_.exists = fs.existsSync || pth.existsSync;

/**
 * 是否为文件夹
 * @param  {String}  path 路径
 * @return {Boolean}      true为是
 * @name isDir
 * @function
 */
_.isDir = function (path) {
  return _.exists(path) && fs.statSync(path).isDirectory();
};

/**
 * 递归创建文件夹
 * @param  {String} path 路径
 * @param  {Number} mode 创建模式
 * @name mkdir
 * @function
 */
_.mkdir = function (path, mode) {
  if (typeof mode === 'undefined') {
    // 511 === 0777
    const maxPower = 511;
    mode = maxPower & (~process.umask());
  }
  if (_exists(path)) {
    return;
  }
  path.split('/').reduce(function (prev, next) {
    if (prev && !_exists(prev)) {
      fs.mkdirSync(prev, mode);
    }
    return prev + '/' + next;
  });
  if (!_exists(path)) {
    fs.mkdirSync(path, mode);
  }
};

/**
 * shell编码转义
 * @param  {String} 命令
 * @memberOf chameleon.utils
 * @name escapeShellArg
 * @function
 */
_.escapeShellArg = function (cmd) {
  return '"' + cmd + '"';
};

/**
 * 是否为windows系统
 * @return {Boolean}
 * @name isWin
 * @function
 */
_.isWin = function () {
  return IS_WIN;
};

_.open = function (path, callback) {
  var cmd = cml.utils.escapeShellArg(path);
  if (cml.utils.isWin()) {
    cmd = 'start "" ' + cmd;
  } else {
    if (process.env.XDG_SESSION_COOKIE ||
      process.env.XDG_CONFIG_DIRS ||
      process.env.XDG_CURRENT_DESKTOP) {
      cmd = 'xdg-open ' + cmd;
    } else if (process.env.GNOME_DESKTOP_SESSION_ID) {
      cmd = 'gnome-open ' + cmd;
    } else {
      cmd = 'open ' + cmd;
    }
  }
  cml.log.notice(cmd)
  childProcess.exec(cmd, callback);
};

_.isFile = function (filePath) {
  if (fs.existsSync(filePath)) {
    var fileStat = fs.statSync(filePath);
    return fileStat.isFile();
  } else {
    return false;
  }
}

_.isDirectory = function (filePath) {
  if (fs.existsSync(filePath)) {
    var fileStat = fs.statSync(filePath);
    return fileStat.isDirectory();
  } else {
    return false;
  }
}


/**
 * @param {String} filePath  cml文件位置 已经不再支持json文件
 * @param {String} confType 获取的类型 wx|web|weex
 * @return {String} fileContent
 */
/* eslint-disable complexity */
_.getJsonFileContent = function (filePath, confType) {
  filePath = path.join(filePath);
  let content = '';
  if (~filePath.indexOf('.cml')) {
    if (_.isFile(filePath)) {
      let cmlFileContent = fs.readFileSync(filePath, {
        encoding: 'utf-8'
      });
      content = _.getScriptContent({
        content: cmlFileContent,
        cmlType: 'json'
      })
      if (!content) {
        _.log.error(`The file ${filePath}is not exist <script cml-type="json"></script>`)
      }
    } else {
      _.log.error(`There is no file:${filePath}`)
    }
  } else if (~['.wxml', '.axml', '.swan'].indexOf(path.extname(filePath))) {
    let jsonFilePath = filePath.replace(/(\.wxml|\.axml|\.swan)/, '.json');
    if (_.isFile(filePath)) {
      let content = fs.readFileSync(jsonFilePath, {
        encoding: 'utf-8'
      });
      let jsonObject = {}
      try {
        jsonObject = JSON.parse(content);
      } catch (e) {
        log.warn('JSON configThe in file：' + jsonFilePath + ' is not correct ');
      }
      return jsonObject;
    } else {
      _.log.error(`can't find the .json file corresponding to :${filePath}  `)
    }
  } else {
    _.log.error(`The file :${filePath} is missing .json file corresponding to`)
  }

  let jsonObject = {}
  try {
    jsonObject = JSON.parse(content);
  } catch (e) {
    log.warn(`The .json file corresponding to :${filePath} is not correct`);
  }
  jsonObject = jsonObject || {};
  let targetObject = jsonObject[confType] || {};
  if (jsonObject.base) {
    targetObject = _.merge(jsonObject.base, targetObject)
  }
  if (_.isCli()) {
    let fileType = _.getCmlFileType(filePath, cml.projectRoot, confType);
    if (fileType === 'app') {
      targetObject.pages = targetObject.pages || [];
      // 有配置路由文件，给app.json添加pages
      let {routerConfig, hasError} = _.getRouterConfig();
      if (!hasError) {
        if (routerConfig.routes) {
          routerConfig.routes.forEach(item => {
            if (!~targetObject.pages.indexOf(item.path)) {
              let itemPath = item.path;
              // router.config.json中的pages写的是绝对路径，因为小程序中跳转的路径需要是绝对路径，但是app.json中的pages不能以/开头
              if (itemPath[0] === '/') {
                itemPath = itemPath.slice(1);
              }
              targetObject.pages.push(itemPath);
            }
          })
        }
      }
      // 处理copyNpm 直接拷贝的pages
      let copyNpm = cml.config.get().copyNpm && cml.config.get().copyNpm[confType];
      if (copyNpm && copyNpm.length > 0) {
        copyNpm.forEach(function(npmName) {
          let packageJson = JSON.parse(fs.readFileSync(path.join(cml.projectRoot, 'node_modules', npmName, 'package.json'), {encoding: 'utf-8'}));
          let cmlConfig = packageJson.cml && packageJson.cml[confType]; 
          if (cmlConfig && cmlConfig.pages && cmlConfig.pages.length > 0) {
            cmlConfig.pages.forEach(item => {
              if (!~targetObject.pages.indexOf(item)) {
                targetObject.pages.push(item);
              } else {
                cml.log.error(`page ${item} in ${npmName} is conflict in project!`)
              }
            })
          }
        })
      }
      // 处理subProject配置的npm包中cml项目的页面
      let subProject = cml.config.get().subProject;
      if (subProject && subProject.length > 0) {
        subProject.forEach(function(npmName) {
          let npmRouterConfig = _.readsubProjectRouterConfig(cml.projectRoot, npmName);
          npmRouterConfig.routes && npmRouterConfig.routes.forEach(item => {
            let cmlFilePath = path.join(cml.projectRoot, 'node_modules', npmName, 'src', item.path + '.cml');
            let routePath = _.getPureEntryName(cmlFilePath, confType, cml.projectRoot);
            routePath = _.handleSpecialChar(routePath);
            if (routePath[0] === '/') {
              routePath = routePath.slice(1);
            }
            if (!~targetObject.pages.indexOf(routePath)) {
              targetObject.pages.push(routePath);
            } else {
              cml.log.error(`page ${routePath} in ${npmName} is conflict in project!`)
            }
          })

        })
      }

    } else if (fileType === 'component') {
      targetObject.component = true;
    } else {
      delete targetObject.component;
    }
  } else {
    // cli 外的如果加了page 为true,则为page  其他的component
    if (targetObject.page === true) {
      delete targetObject.page;
    } else {
      targetObject.component = true;
    }
  }
  return targetObject;
}
/* eslint-disable complexity */


// 获取路由配置文件对象
_.getRouterConfig = function() {
  // 有配置路由文件，给app.json添加pages
  let routerConfigPath = path.join(cml.projectRoot, 'src/router.config.json');
  let routerConfig = {};
  let hasError = false;
  try {
    let content = fs.readFileSync(routerConfigPath, {
      encoding: 'utf-8'
    });
    routerConfig = JSON.parse(content);
  } catch (e) {
    hasError = true;
  }
  return {
    hasError,
    routerConfig
  };
}

// 分离文件
_.splitParts = function ({
  content,
  options
}) {

  const cacheKey = hash(content)
  let parts = cache.get(cacheKey)
  if (parts) {
    return parts;
  }
  parts = splitParts(content, options);
  cache.set(cacheKey, parts);
  return parts;
}

// 获取cmlType类型的script part
_.getScriptPart = function ({
  content,
  options,
  cmlType
}) {
  let parts = _.splitParts({
    content,
    options
  });
  let scripts = parts.script || [];
  for (let i = 0; i < scripts.length; i++) {
    let item = scripts[i];
    if (item.cmlType === cmlType) {
      return item;
    }
  }
  return null
}

// 获取cmlType类型的script content
_.getScriptContent = function ({
  content,
  options,
  cmlType
}) {
  let part = _.getScriptPart({
    content,
    options,
    cmlType
  });
  return part && part.content;
}

// 删除类型的script content
_.deleteScript = function ({
  content,
  options,
  cmlType
}) {
  let part = _.getScriptPart({
    content,
    options,
    cmlType
  });
  if (part) {
    content = content.slice(0, part.tagStart) + content.slice(part.tagEnd)
  }
  return content;
}

// 检查配置文件
_.checkProjectConfig = function () {
  /* istanbul ignore if  */
  if (!cml.config.loaded) {
    log.error('Chameleon command line should be excuted in the root directory or  there is short of the file :chameleon.config.js in the root directory   ')
    process.exit();
  }
}

// 获取项目中配置的npm componets组件
_.getNpmComponents = function (cmlType, context) {
  if (!_.isCli()) {
    return []
  }
  cml.npmComponents = cml.npmComponents || {};

  if (cml.npmComponents[cmlType]) {
    return cml.npmComponents[cmlType];
  }
  // 配置的npmComponets,在生成wx的json文件和weex注册组件时还是要用处理
  let npmComponents = [];

  let cmlComponents = cml.config.get().cmlComponents || [];
  if (cml.utils.is(cmlComponents, 'Array')) {
    // 放入内置组件
    cmlComponents = [...new Set(cmlComponents)];

    cmlComponents.forEach(npmName => {
      let packageFilePath = path.join(cml.projectRoot, 'node_modules', npmName, 'package.json');
      let result = _.getOnePackageComponents(npmName, packageFilePath, cmlType, context);
      npmComponents = npmComponents.concat(result)

    })
  } else {
    throw new Error(`The field : cmlComponents in chameleon.config.js should be arraytype `)
  }

  return cml.npmComponents[cmlType] = npmComponents;
}


const cacheBuildIn = {};
// 获取内置组件的数据
_.getBuildinComponents = function (cmlType, context) {
  if (cacheBuildIn[cmlType]) {
    return cacheBuildIn[cmlType];
  }
  let packageFilePath = path.join(context, 'node_modules', builtinNpmName, 'package.json');
  let result = _.getOnePackageComponents(builtinNpmName, packageFilePath, cmlType, context);
  let compileTagMap = {};
  // 内置组件的componet name需要特殊处理，并且挂在cml上给模板编译做处理
  result.forEach(item => {
    let newName = `cml-buildin-${item.name}`;
    compileTagMap[item.name] = newName;
    item.name = newName;
    item.builtInOriginName = item.name;
    item.isBuiltin = true;

  })
  return cacheBuildIn[cmlType] = {
    components: result,
    compileTagMap
  }

}

// 获取这个组件要插入的组件
_.getTargetInsertComponents = function (filePath, cmlType, context) {
  filePath = path.join(filePath);
  let result = [];

  // 内建不需要插入
  if (_.isBuildIn(filePath)) {
    return result;
  }

  // node_modules中的不自动引入
  if (!~filePath.indexOf('node_modules')) {
    let npmComponents = _.getNpmComponents(cmlType, context);
    result = result.concat(npmComponents);
  }
  let buildIn = _.getBuildinComponents(cmlType, context);
  result = result.concat(buildIn.components);

  let targetFileDir = path.dirname(filePath);
  // 删除自身的引用
  result = result.filter(item => {
    if (item) {
      item.filePath = path.join(item.filePath);
      let comdir = path.dirname(item.filePath);
      return targetFileDir !== comdir;
    }
    return false;
  })

  return result;

}


/**
 * 是否是内置组件
 */
_.isBuildIn = function (filePath) {
  let result = false;
  if (_.isCli()) {
    if (cml.config.get().isBuildInProject || ~filePath.indexOf(builtinNpmName)) {
      result = true;
    }
  } else {
    if (~filePath.indexOf(builtinNpmName)) {
      result = true;
    }
  }
  return result;
}

// 给json文件添加npm和buildin的components
_.addNpmComponents = function (jsonObject, jsonFile, cmlType, context) {
  let npmComponents = _.getTargetInsertComponents(jsonFile, cmlType, context);
  if (npmComponents.length) {
    let coms = jsonObject.usingComponents = jsonObject.usingComponents ? jsonObject.usingComponents : {};
    let customComsKeys = Object.keys(coms);
    npmComponents.forEach(item => {
      let npmcomName = item.name;
      if (item.isBuiltin) {
        npmcomName = item.name.replace('cml-buildin-', '');
      }
      // 如果自动引入的组件与用户自定义组件重名则不自动引入
      if (!~customComsKeys.indexOf(npmcomName)) {
        // refPath 改为相对路径
        let refPath = _.npmRefPathToRelative(item.refPath, jsonFile, context);
        coms[item.name] = refPath;
      }
    })
  }
}

// 通过单个packages
_.getOnePackageComponents = function (npmName, packageFilePath, cmlType, context) {
  let components = [];
  if (_.isFile(packageFilePath)) {
    let packageFile = fs.readFileSync(packageFilePath);
    let packageJson = JSON.parse(packageFile);
    let main = '';
    if (packageJson && packageJson.main) {
      main = packageJson && packageJson.main;
    }
    let globPath = path.join(context, 'node_modules', npmName, main, '/**/*.cml');

    // 需要忽略掉的组件
    let ignoreComponents = ['web', 'weex', 'wx', 'alipay', 'baidu'];
    if (~ignoreComponents.indexOf(cmlType)) {
      ignoreComponents.splice(ignoreComponents.indexOf(cmlType), 1);
    }
    ignoreComponents = ignoreComponents.map(item => `\\.${item}\\.cml`)

    let ignoreReg = new RegExp(`(${ignoreComponents.join('|')})`);

    let cmlExtReg = new RegExp(`(\\.cml|\\.${cmlType}.cml)`)
    glob.sync(globPath).forEach(comPath => {
      // 其他端的多态cml组件排除在外
      if (!ignoreReg.test(comPath)) {
        let comKey = path.basename(comPath).replace(cmlExtReg, '');
        components.push({
          name: comKey,
          filePath: comPath,
          refPath: _.npmComponentRefPath(comPath, context)
        })
      }
    })
  }

  return components;

}

/**
 * @param root 项目根目录
 * @param cmlFilePath cml文件的绝对路径
 * @param comPath json文件中引用的组件的路径
 * @param cmlType cmlType   wx web weex
 * @return {
 *  filePath: 组件的绝对路径
 *  refUrl: 规范化后json文件中组件引用的路径
 * }
 */

_.handleComponentUrl = function (context, cmlFilePath, comPath, cmlType) {
  // plugin://  对于小程序插件不做处理
  if (comPath.indexOf('plugin://') === 0) {
    return {
      filePath: '',
      refUrl: comPath
    }
  }
  let srcPath = path.join(context, 'src');
  let npmPath = path.join(context, 'node_modules');
  let refUrl = comPath; // json文件中引用的组件链接
  let filePath; // 组件cml文件位置
  let findFile = false;

  // 相对路径查找
  if (comPath[0] === '.') {
    let cmlbasepath = path.dirname(cmlFilePath);
    filePath = path.resolve(cmlbasepath, comPath);

    let extPath = _.findComponent(filePath, cmlType);
    if (extPath) {
      filePath = extPath;
      findFile = true;
    }
  } else {
    // src目录
    filePath = path.join(srcPath, comPath);
    let extPath = _.findComponent(filePath, cmlType);
    if (extPath) {
      filePath = extPath;
      findFile = true;
    } else {
      // 项目根目录下查找
      filePath = path.join(context, comPath);
      let extPath = _.findComponent(filePath, cmlType);
      if (extPath) {
        filePath = extPath;
        findFile = true;
      } else {
        // node_modules中查找
        filePath = path.join(npmPath, comPath);
        let extPath = _.findComponent(filePath, cmlType);
        if (extPath) {
          filePath = extPath;
          findFile = true;
        }
      }
    }
  }
  if (!findFile) {
    return {
      filePath: '',
      refUrl
    }
  }
  if (~filePath.indexOf('node_modules')) {
    refUrl = _.npmComponentRefPath(filePath, context);
    // 改为相对路径
    refUrl = _.npmRefPathToRelative(refUrl, cmlFilePath, context);

  } else {
    // 改成相对路径
    refUrl = _.handleRelativePath(cmlFilePath, filePath);
  }

  refUrl = refUrl.replace(new RegExp(`(\\.cml|\\.${cmlType}\\.cml)`), '');
  if (cmlType === 'wx') {
    refUrl = refUrl.replace(/\.wxml$/g, '');
  }
  if (cmlType === 'alipay') {
    refUrl = refUrl.replace(/\.axml$/g, '');
  }

  if (cmlType === 'baidu') {
    refUrl = refUrl.replace(/\.swan$/g, '');
  }

  return {
    refUrl,
    filePath
  }

}

// 判断不带后缀的文件路径是否存在
// filePath  是不带后缀的文件路径
_.findComponent = function (filePath, cmlType) {
  // 如果没有传递cmlType  默认是interface  这个情况是给cmllint用的 构建必须传cmlType
  // cml-linter 需要获取interface文件
  if (cmlType === 'interface') {
    let interfaceFile = filePath + '.interface';
    if (_.isFile(interfaceFile)) {
      return interfaceFile;
    } else {
      return false;
    }

  }
  let extlist = ['.cml', `.${cmlType}.cml`];
  for (let i = 0; i < extlist.length; i++) {
    let newFilePath = filePath + extlist[i];
    if (_.isFile(newFilePath)) {
      return newFilePath;
    }
  }
  let fileExtMap = {
    weex: ['.vue', '.js'],
    web: ['.vue', '.js'],
    wx: '.wxml',
    baidu: '.swan',
    alipay: '.axml'
  }

  let ext = fileExtMap[cmlType];
  if (typeof ext === 'string') {
    ext = [ext];
  }
  for (let i = 0; i < ext.length; i++) {
    let extFilePath = filePath + ext[i];
    if (_.isFile(extFilePath)) {
      return extFilePath;
    }
  }
  return false;
}

// 提供给cml-lint使用 cml-lint不知道cmlType
_.lintHandleComponentUrl = function(context, cmlFilePath, comPath) {
  let cmlTypeList = ['wx', 'web', 'weex', 'alipay', 'baidu'];
  for (let i = 0; i < cmlTypeList.length; i++) {
    let cmlType = cmlTypeList[i];
    let result = _.handleComponentUrl(context, cmlFilePath, comPath, cmlType);
    if (result.filePath) {
      // 如果是.cml并且不是多态的cml文件
      let cmlReg = new RegExp(`\\.${cmlType}\\.cml$`)
      if (/\.cml$/.test(result.filePath) && !cmlReg.test(result.filePath)) {
        result.isCml = true;
      }
      return result;
    }
  }

  return {
    filePath: '',
    refUrl: comPath
  }
}

// 查找interface文件 cml-linter需要
_.findInterfaceFile = function(context, cmlFilePath, comPath) {
  return _.handleComponentUrl(context, cmlFilePath, comPath, 'interface');
}

/**
 * @description 将/npm 的组件引用改为相对路径
 * @param npmRefPath npm绝对引用路径  /npm/cml-ui/button/button
 * @param cmlFilePath cml文件路径
 * @param context 项目根目录
 */
_.npmRefPathToRelative = function(npmRefPath, cmlFilePath, context) {
  if (npmRefPath[0] === '/') {
    let entryPath = _.getEntryPath(cmlFilePath, context);
    // pages/index/index.cml  derLength = 2
    let dirLength = entryPath.split('/').length - 1;
    let relativePath = './';
    for (let i = 0; i < dirLength; i++) {
      relativePath += '../';
    }
    npmRefPath = npmRefPath.slice(1);
    npmRefPath = relativePath + npmRefPath;
    return npmRefPath;
  } else {
    return npmRefPath;
  }
}

// 处理npm中组件的引用路径 root是项目根目录 得到的是绝对路径/npm
_.npmComponentRefPath = function (componentAbsolutePath, context) {
  let refUrl = '';
  refUrl = path.relative(context, componentAbsolutePath);
  refUrl = refUrl.replace('node_modules', 'npm');
  refUrl = _.handleWinPath(refUrl);
  if (refUrl[0] !== '/') {
    refUrl = '/' + refUrl
  }
  refUrl = refUrl.replace(/(\.cml|\.web\.cml|\.alipay\.cml|\.baidu\.cml|\.wx\.cml|\.weex\.cml)/, '');
  return refUrl;

}

// 已经弃用了 因为在handleComponentUrl 已经返回正确的相对路径
// 将json文件中usingComponents中的组件引用路径从绝对路径改为相对路径，export导出模式要求相对路径
// 如果是绝对路径 导出的组件只能放到项目根目录下，最后生成json文件的时候修改
_.convertToRelativeRef = function (jsonFilePath, jsonObject) {
  // if (jsonFilePath[0] !== '/') {
  //   jsonFilePath = '/' + jsonFilePath;
  // }
  let components = jsonObject.usingComponents;
  if (components) {
    Object.keys(components).forEach(key => {
      let absoluteRef = components[key];
      // plugin:// 开头不处理
      if (absoluteRef.indexOf('plugin://') !== 0) {
        let relativePath = _.handleRelativePath(jsonFilePath, absoluteRef);
        components[key] = relativePath;
      }
    })
  }
}

/**
 * @param  {String} sourcePath 源文件地址 绝对路径
 * @param  {String} targetPath 目标文件地址  绝对路径
 * @param  {String} 目标文件相对源文件的相对路径
 */
_.handleRelativePath = function(sourcePath, targetPath) {
  sourcePath = path.join(sourcePath);
  targetPath = path.join(targetPath);
  let relativePath = path.relative(sourcePath, targetPath);
  if (relativePath == '..' || relativePath == '.') {
    relativePath = ''
  } else {
    relativePath = relativePath.slice(3); // eslint-disable-line
  }
  relativePath = _.handleWinPath(relativePath);
  // 不是绝对路径都加上./  否则同一目录文件引用有问题  这里的路径是给代码中使用 统一处理成正斜杠
  if (relativePath.indexOf('/') !== 0) {
    relativePath = './' + relativePath;
  }
  return relativePath;
}


_.handleWinPath = function (url) {
  if (_.isWin()) {
    url = url.replace(/\\/g, '/');
  }
  return url;
}

/**
 * cml 插件，仅支持同步
 * 注册插件
 * @param  {[String]} pluginKey [插件key]
 * @param  {[any]} pluginParams      [插件所需数据]
 * @param  {[Function]} callback    [插件完成后的回调]
 */
_.applyPlugin = function (pluginKey, pluginParams, callback) {
  callback && cml.event.on(getPluginKey('2', pluginKey), callback);
  cml.event.emit(getPluginKey('1', pluginKey), pluginParams);
}

/**
 * 调用插件
 * @param  {[String]} pluginKey [插件key]
 * @param  {[Function]} handle(pluginParams, callback)  [插件执行的内容]
 *         handle~pluginParams: [插件所需数据]
 *         handle~callback(data):     [插件完成后执行回调]
 *         handle~callback~data:      [插件处理后的数据传给cml主程序]
 */
_.plugin = function (pluginKey, handle) {
  cml.event.on(getPluginKey('1', pluginKey), function (pluginParams) {
    handle(pluginParams, function (data) {
      cml.event.emit(getPluginKey('2', pluginKey), data);
    });
  });
}

function getPluginKey(type, key) {
  return `__${type === "1" ? "plugineventout" : "plugineventin"}__${key}__`;
}


// 获取export模式的入口cml文件
_.getExportEntry = function (cmlType, context, entry = []) {
  let exportFiles = [];
  if (entry && entry.length > 0) {
    entry.forEach(item => {
      let filePath = path.join(context, item);
      if (_.isFile(filePath)) {
        exportFiles.push(filePath);
      } else if (_.isDirectory(filePath)) {
        filePath = path.join(filePath, '**/*.cml');
        // 需要忽略掉的组件
        let ignoreComponents = ['web', 'weex', 'wx', 'alipay', 'baidu'];
        if (~ignoreComponents.indexOf(cmlType)) {
          ignoreComponents.splice(ignoreComponents.indexOf(cmlType), 1);
        }
        ignoreComponents = ignoreComponents.map(item => `\\.${item}\\.cml`);

        let ignoreReg = new RegExp(`(${ignoreComponents.join('|')})`);

        glob.sync(filePath).forEach(cmlPath => {
          // 其他端的多态cml组件排除在外
          if (!ignoreReg.test(cmlPath)) {
            exportFiles.push(cmlPath);
          }
        })
      }
    })
  } else {
    _.log.warn('please assign the entry of what you want to export')
  }
  if (exportFiles.length == 0) {
    throw new Error(`can't find the entry file that you want to export`)
  }
  return exportFiles;
}


/**
 * 根据cml文件路径获取webpack入口entry名称
 * /user/didi/cml/src/pages/index/index.cml to pages/index/index
  /user/didi/cml/node_modules/cml-ui/toast/toast.cml to npm/cml-ui/toast/toast
 */
_.getPureEntryName = function (cmlFilePath, cmlType, context) {
  let entryPath = _.getEntryPath(cmlFilePath, context);
  let cmlExtReg = new RegExp(`(\\.cml|\\.${cmlType}.cml)`);
  if (cmlType === 'wx') {
    entryPath = entryPath.replace(/\.wxml/g, '');
  }
  if (cmlType === 'alipay') {
    entryPath = entryPath.replace(/\.axml/g, '');
  }
  if (cmlType === 'baidu') {
    entryPath = entryPath.replace(/\.swan/g, '');
  }
  return entryPath.replace(cmlExtReg, '');
}

/**
 * 获取文件生成的路径 去除项目根目录和node_modules的路径 带有文件后缀，weback入口与生成小程序文件中使用
/user/didi/cml/src/pages/index/index.cml to pages/index/index.cml
/user/didi/cml/node_modules/cml-ui/toast/toast.cml to npm/cml-ui/toast/toast.cml
*/
_.getEntryPath = function (filePath, context) {
  let root = context;
  let projectPath = path.resolve(root, 'src');
  let entryName;
  if (~filePath.indexOf('node_modules')) {
    entryName = path.relative(root, filePath);
    entryName = entryName.replace('node_modules', 'npm');
  } else {
    entryName = path.relative(projectPath, filePath);
  }
  entryName = _.handleWinPath(entryName);
  return entryName;
}

/**
 * 获取cml文件的类型
 * @param cmlFilePath   cml文件的路径
 * @param context 项目根目录
 * @param cmlType 构建类型
 */
_.getCmlFileType = function(cmlFilePath, context, cmlType) {
  let type = '';
  if (!_.isCli()) {
    // 如果不是cli中 统一当做组件处理,目前cli外 的页不会调用该方法
    type = 'component';
  } else {
    var entryName = _.getPureEntryName(cmlFilePath, cmlType, context);
    if (entryName === 'app/app') {
      type = 'app';
    } else {
      let subProject = cml.config.get().subProject || [];
      let npmNames = subProject.map(item => 'node_modules/' + item);
      let subProjectIndex = -1;
      for (let i = 0; i < npmNames.length; i++) {
        if (~cmlFilePath.indexOf(npmNames[i])) {
          subProjectIndex = i;
          break;
        }
      }
      // 是subProject npm包中的cml文件 用subProject中的router.config.json判断
      if (subProjectIndex != -1) {
        let routerConfig = _.readsubProjectRouterConfig(context, subProject[subProjectIndex]);
        let pageFiles = routerConfig.routes.map(item => {
          return path.join(context, 'node_modules', subProject[subProjectIndex], 'src', item.path + '.cml');
        })
        // 如果是配置的路由则是page
        if (~pageFiles.indexOf(cmlFilePath)) {
          type = 'page';
        } else {
          type = 'component';
        }
      } else {
        // 不是subProject 中的cml文件走正常判断
        let {routerConfig, hasError} = _.getRouterConfig();
        if (!hasError) {
          let routes = routerConfig.routes;
          // 删除/
          let pageNames = routes.map(item => {
            if (item.path && item.path[0] == '/') {
              return item.path.slice(1);
            } else {
              return '';
            }
          })
          // 如果是配置的路由则是page
          if (~pageNames.indexOf(entryName)) {
            type = 'page';
          } else {
            type = 'component';
          }
        }
      }

    }
  }
  return type;

}

// 小程序中有文件夹有@符号无法上传
_.handleSpecialChar = function (str) {
  let result = str.replace(/\@/g, '_')
  return result
}

_.readsubProjectRouterConfig = function(context, npmName) {
  return JSON.parse(fs.readFileSync(path.join(context, 'node_modules', npmName, 'src/router.config.json'), {encoding: 'utf-8'}))
}
