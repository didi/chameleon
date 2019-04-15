const CMLNode = require('./cmlNode.js');
const path = require('path');
const Log = require('./log.js');
const EventEmitter = require('events');
const cmlUtils = require('chameleon-tool-utils');
class Compiler {
  constructor(webpackCompiler) {
    this.moduleRule = [ // 文件后缀对应module信息
      {
        test: /\.css|\.less$/,
        moduleType: 'style',
        attrs: {
          lang: 'less'
        }
      },
      {
        test: /\.stylus|\.styls$/,
        moduleType: 'style',
        attrs: {
          lang: 'stylus'
        }
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
    this.log = new Log();
    this.event = new EventEmitter();
    this.webpackCompiler = webpackCompiler;
  }

  run(modules) {
    debugger
    this.projectGraph = null;
    this.outputFiles = {};
    this.module2Node(modules);
    this.customCompile();
    this.emit('pack', this.projectGraph);
    this.emitFiles();

  }

  emit(eventName, ...params) {
    this.log.debug('emit log:' + eventName + 'params:' + params)
    this.event.emit(eventName, ...params);
  }


  // 处理webpack modules
  module2Node(modules) {
    let appModule;
    for (let i = 0; i < modules.length; i++) {
      let item = modules[i];
      if (item._nodeType === 'app') {
        appModule = item;
      }
      // 静态资源的写入
      if (item._nodeType === 'module' && item._moduleType === 'asset') {
        if (item._cmlSource && item._outputPath) {
          this.writeFile(item._outputPath, item._cmlSource);
        }
      }
    }

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
    options.realPath = module.resource;
    options.ext = path.extname(module.resource);
    options.nodeType = module._nodeType || 'module';
    options.identifier = module.rawRequest;
    options.modId = module.rawRequest; // 模块化的id 这里可以优化成hash
    if (options.nodeType === 'module') {
      // loader中设置
      if (module._moduleType) {
        options.moduleType = module._moduleType;
      } else {
        // 根据后缀
        this.moduleRule.forEach(rule => {
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

    return new CMLNode(options)
  }


  // 开启用户自定义编译
  customCompile() {
    // 队列串行编译
    //  递归编译
    this.customCompileNode(this.projectGraph);
  }

  customCompileNode(currentNode) {

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
    let outputPath = this.webpackCompiler.options.output.path;
    for (let key in this.outputFiles) {
      if (this.outputFiles.hasOwnProperty(key)) {
        let outFilePath = path.join(outputPath, key);
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
}

module.exports = Compiler;
