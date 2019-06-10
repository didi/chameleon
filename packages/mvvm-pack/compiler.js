const CMLNode = require('./cmlNode.js');
const path = require('path');
const Log = require('./log.js');
const EventEmitter = require('events');
const cmlUtils = require('chameleon-tool-utils');
const {cmlparse} = require('mvvm-template-parser');
const amd = require('./lib/amd.js');
const {handleScript, chameleonIdHandle} = require('./lib/handleScript.js');
const UglifyJs = require('./minimize/uglifyjs.js');
const UglifyCSS = require('./minimize/uglifycss.js');
class Compiler {
  constructor(webpackCompiler, plugin, options) {
    this.moduleRules = [ // 文件后缀对应module信息
      { 
        test: /\.css|\.less|\.stylus|\.styls$/,
        moduleType: 'style'
      },
      {
        test: /\.js|\.interface$/,
        moduleType: 'script'
      },
      {
        test: /\.json$/,
        moduleType: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2?|eot|ttf|otf)(\?.*)?$/,
        moduleType: 'asset'
      }
    ]
    this.outputFiles = {}; // 输出文件 key为文件路径 value为输出文件内容
    this.projectGraph = null;
    this.log = new Log({
      level: plugin.logLevel || 2
    });
    this.event = new EventEmitter();
    this.webpackCompiler = webpackCompiler;

    // 用户扩展文件类型
    if (plugin.moduleRules && plugin.moduleRules instanceof Array) {
      this.moduleRules = this.moduleRules.concat(plugin.moduleRules);
    }

    this.amd = amd; // amd的工具方法
    this.hasCompiledNode = []; // 记录已经编译的模块 避免重复编译
    this.cmlType = options.cmlType;
    this.media = options.media;
    this.userPlugin = plugin;
    this.outputPath = this.webpackCompiler.options.output.path;
    this.definitions = {}; //
    this.getDefinePlugins();
  }

  run(modules) {
    this.projectGraph = null;
    this.outputFiles = {};
    this.hasCompiledNode = [];
    this.module2Node(modules);
    this.customCompile();
    this.emit('pack', this.projectGraph);

    this.emitFiles();
  }

  emit(eventName, ...params) {
    this.log.debug('emit log:' + eventName + 'params:' + params)
    this.event.emit(eventName, ...params);
  }

  hook(eventName, cb) {
    this.event.on(eventName, cb);
  }

  getDefinePlugins() {
    let plugins = this.webpackCompiler.options.plugins.filter(item => {
      return 'definitions' in item
    });
    let definitions = {};
    plugins.forEach(item => {
      definitions = {
        ...definitions,
        ...item.definitions
      }
    })
    this.definitions = definitions;
  }

  // 处理webpack modules
  module2Node(modules) {
    let appModule;
    let styleModule = [];
    // 资源的publicPath map对象
    let assetPublicMap = {};

    for (let i = 0; i < modules.length; i++) {
      let item = modules[i];
      if (item._nodeType === 'app') {
        appModule = item;
      }
      // 静态资源的写入
      if (item._nodeType === 'module' && item._moduleType === 'asset') {
        // 写入资源文件
        if (item._bufferSource && item._outputPath) {
          // 用户插件中执行静态资源位置，而不影响publicPath
          let outputPath = item._outputPath;
          if (this.userPlugin.assetsPrePath) {
            outputPath = this.userPlugin.assetsPrePath + outputPath;
          }
          this.writeFile(outputPath, item._bufferSource);
        }
        assetPublicMap[item.resource] = item._publicPath;
      }

      if (item._nodeType === 'module' && item._moduleType === 'style') {
        styleModule.push(item);
      }
    }

    // style模块中静态资源路径的处理
    styleModule.forEach(item => {
      if (item._cmlSource) {
        item._cmlSource = item._cmlSource.replace(/__cml(.*?)__lmc/g, function(all, $1) {
          if (assetPublicMap[$1]) {
            return `url("${assetPublicMap[$1]}")`
          } else {
            cml.log.error(`not find asset module ${$1}`);
          }
        })
      }
    })


    if (!appModule) {
      throw new Error('not find app.cml node!')
    }

    // 记录已经创建的节点
    let moduleNodeMap = new Map();
    this.projectGraph = this.createGraph(appModule, null, moduleNodeMap);

  }

  // 创建依赖图
  createGraph(targetModule, currentNode, moduleNodeMap) {
    // 第一个app节点
    if (!currentNode) {
      currentNode = this.createNode(targetModule);
      moduleNodeMap.set(targetModule, currentNode);
    }
    targetModule.dependencies.forEach(item => {
      if (item.module) {
        // 如果已经创建了节点
        if (moduleNodeMap.has(item.module)) {
          let subNode = moduleNodeMap.get(item.module);
          // 如果 子节点的文件路径和父节点相同 ze是CML文件 放入childrens
          if (subNode.realPath === currentNode.realPath) {
            subNode.parent = currentNode;
            currentNode.childrens.push(subNode);
          } else {
            currentNode.dependencies.push(subNode);
          }

        } else {
          // 创建节点
          let subNode = this.createNode(item.module);
          moduleNodeMap.set(item.module, subNode);
          if (subNode.realPath === currentNode.realPath) {
            subNode.parent = currentNode;
            currentNode.childrens.push(subNode);
          } else {
            currentNode.dependencies.push(subNode);
          }
          // 递归创建
          this.createGraph(item.module, subNode, moduleNodeMap)
        }
      }
    })
    return currentNode;
  }

  // 创建单个节点
  createNode(module) {
    let options = {};
    options.realPath = module.resource; // 会带参数  资源绝对路径
    options.ext = path.extname(module.resource);
    options.nodeType = module._nodeType || 'module';
    // 新的modId
    let modId = chameleonIdHandle(module.id + '');
    options.identifier = modId;
    options.modId = modId; // 模块化的id todo优化hash
    if (options.nodeType === 'module') {
      // loader中设置
      if (module._moduleType) {
        options.moduleType = module._moduleType;
      } else {
        // 根据后缀
        this.moduleRules.forEach(rule => {
          if (rule.test.test(module.resource)) {
            options.moduleType = rule.moduleType;
          }
        })
        options.moduleType = options.moduleType || 'other';
      }
    }

    // 可能出现module._cmlSource为空字符串的情况
    if (module._cmlSource !== undefined) {
      options.source = module._cmlSource;
    } else {
      options.source = module._source && module._source._value;
    }

    if (module._cmlOriginSource !== undefined) {
      options.originSource = module._cmlOriginSource;
    }

    if (options.moduleType === 'template') {
      options.convert = cmlparse(options.source);
    }

    if (options.moduleType === 'json') {
      // cml文件中的json部分
      // todo 这里进不来
      if (/^\{[\s\S]*\}$/.test(options.source)) {
        options.convert = JSON.parse(options.source);
      }
      // 其他json文件不处理 例如router.config.json
    }

    if (options.moduleType === 'script') {
      // 要做js中require模块的处理 替换modId
      options.source = handleScript(options.source, module, this.definitions);
    }
    options.extra = module._cmlExtra || undefined;
    return new CMLNode(options)
  }


  // 开启用户自定义编译
  customCompile() {
    // 队列串行编译
    //  递归编译

    this.customCompileNode(this.projectGraph);
  }

  customCompileNode(currentNode) {
    if (~this.hasCompiledNode.indexOf(currentNode)) {
      return;
    }
    this.hasCompiledNode.push(currentNode);
    if (~['app', 'page', 'component'].indexOf(currentNode.nodeType)) {
      this.emit(`compile-preCML`, currentNode, currentNode.nodeType);
    } else {
      // template script style json
      let parent = currentNode.parent || {};
      this.emit(`compile-${currentNode.moduleType}`, currentNode, parent.nodeType);
    }
    currentNode.childrens.forEach(item => {
      this.customCompileNode(item);
    })

    currentNode.dependencies.forEach(item => {
      this.customCompileNode(item);
    })

    if (~['app', 'page', 'component'].indexOf(currentNode.nodeType)) {
      this.emit(`compile-postCML`, currentNode, currentNode.nodeType);
    }
  }


  writeFile(filePath, content) {
    if (this.outputFiles[filePath]) {
      throw new Error(`has already write file ${filePath}`);
    } else {
      this.outputFiles[filePath] = content;
    }
  }

  emitFiles() {
    let self = this;
    let config = (cml.config.get()[self.cmlType] && cml.config.get()[self.cmlType][self.media]) || {};
    let {hash, minimize} = config;
    let minimizeExt = this.userPlugin.minimizeExt;
    let minimizeExtMap = {};
    if (minimizeExt) {
      Object.keys(minimizeExt).forEach(key => {
        minimizeExt[key].forEach(ext => {
          minimizeExtMap[ext] = key;
        })
      })
    }

    let outputPath = this.webpackCompiler.options.output.path;
    for (let key in this.outputFiles) {
      if (this.outputFiles.hasOwnProperty(key)) {
        let outFilePath = path.join(outputPath, key);
        if (minimize === true && minimizeExt) {
          let ext = path.extname(outFilePath);
          let miniType = minimizeExtMap[ext]; // js or css
          if (miniType === 'js') {
            let result = UglifyJs(this.outputFiles[key], outFilePath);
            if (result === undefined) {
              throw new Error(`uglifyjs error from ${outFilePath}`);
            } else {
              this.outputFiles[key] = result;
            }
          }

          if (miniType === 'css') {
            let result = UglifyCSS(this.outputFiles[key], outFilePath);
            if (result === undefined) {
              throw new Error(`uglifycss error from ${outFilePath}`);
            } else {
              this.outputFiles[key] = result;
            }
          }
        }
        if (hash === true) {
          outFilePath = cmlUtils.addHashName(outFilePath, cmlUtils.createMd5(this.outputFiles[key]))
        }
        if (typeof this.outputFiles[key] === 'string') {
          cmlUtils.fse.outputFileSync(outFilePath, this.outputFiles[key])
        } else {
          cmlUtils.fse.outputFileSync(outFilePath, this.outputFiles[key], {
            encoding: 'binary'
          })
        }
      }
    }
  }

  getRouterConfig() {
    let {routerConfig} = cmlUtils.getRouterConfig();
    let subProjectRouter = cmlUtils.getSubProjectRouter();
    return {
      projectRouter: routerConfig,
      subProjectRouter: subProjectRouter
    }
  }
}

module.exports = Compiler;
