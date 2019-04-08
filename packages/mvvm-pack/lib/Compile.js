const Event = require('./Event');
const ResolveFactory = require('./ResolveFactory');
const NodeEnvironmentPlugin = require('./FileSystem/NodeEnvironmentPlugin.js');
const CMLNode = require('./CMLNode.js');
const path = require('path');
const cmlUtils = require('chameleon-tool-utils');
const CMLParser = require('mvvm-template-parser');
const CMSSParser = require('mvvm-style-parser');
const JSParser = require('mvvm-script-parser');
const fs = require('fs');
const Watching = require('./Watching');
const Log = require('./Log');
const {AMDWrapper} = require('./Mod/index.js');
const mime = require('mime');

class Compile {

  constructor(options) {
    this.options = options; // cmlType, media, projectRoot, cmlRoot, config
    this.graphNodeMap = {}; // 创建graph的时候就要注意 同一个文件只能创建一个node 所以要记录有了哪些node  key 为filePath + moduleType  value为Node对象
    this.projectGraph; // 编译图
    this.oneLoopCompiledNode = []; // 一次编译过程编译到的节点，利用这个队列去触发用户的编译，实现了用户编译的缓存。
    this.event = new Event();
    this._resolve = ResolveFactory(options);
    this.fileDependencies = new Set(); // 整个编译过程依赖的文件 编译完成后watch需要
    new NodeEnvironmentPlugin().apply(this); // 文件系统
    this.stringExt = /\.(cml|interface|js|json|css|less|sass|scss|stylus|styl)(\?.*)?$/;// 转成utf-8编码的文件后缀
    this.nodeType = {
      App: 'App',
      Page: 'Page',
      Component: 'Component',
      Module: 'Module'
    }
    this.moduleType = {
      Template: "Template",
      Style: "Style",
      Script: "Script",
      Json: "Json",
      Asset: "Asset",
      Other: "Other"
    }
    this.compileQueue = []; // 待编译节点列表
    this.log = new Log({
      level: options.logLevel || 2
    })
    this.assetsPath = 'static/assets/${filename}_${hash}.${ext}'; // 资源的发布路径 配合publicPath
    this.moduleRule = [ // 文件后缀对应module信息
      {
        test: /\.css|\.less$/,
        moduleType: this.moduleType.Style,
        attrs: {
          lang: 'less'
        }
      },
      {
        test: /\.stylus|\.styls$/,
        moduleType: this.moduleType.Style,
        attrs: {
          lang: 'stylus'
        }
      },
      {
        test: /\.js|\.interface$/,
        moduleType: this.moduleType.Script
      },
      {
        test: /\.json$/,
        moduleType: this.moduleType.Json
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2?|eot|ttf|otf)(\?.*)?$/,
        moduleType: this.moduleType.Asset
      }
    ]

    this.resolve = this.resolve.bind(this);
  }

  // path 是源文件路径 request是要解析的路径
  resolve(start, request, context = {}) {
    start = path.dirname(start);
    return this._resolve.resolveSync(context, start, request)
  }


  watch(watchOptions, handler) {

    this.fileTimestamps = {};
    this.contextTimestamps = {};
    const watching = new Watching(this, watchOptions, handler);
    return watching;
  }

  async run() {
    this.log.debug('start run!');
    this.emit('start-run', Date.now());
    // 每次编译要清空 编译图 重新计算  this.graphNodeMap做缓存
    this.projectGraph = null;
    this.fileDependencies = new Set();
    this.oneLoopCompiledNode = [];
    await this.createProjectGraph();
    await this.customCompile();
    this.emit('end-run', (Date.now()));

  }

  hook(eventName, func) {
    this.event.on(eventName, func);
  }
  emit(eventName, ...params) {
    this.log.debug('emit log:' + eventName + 'params:' + params)
    this.event.emit(eventName, ...params);
  }

  // 触发事件 带通用参数
  commonEmit(eventName, currentNode) {
    let params = {
      currentNode,
      compile: this
    }
    this.event.emit(eventName, params);
  }

  // 创建依赖图
  async createProjectGraph() {

    this.createAppAndPage();

    // 层级编译
    while (this.compileQueue.length) {
      let node = this.compileQueue.shift();
      await this.compileNode(node);
    }

    this.log.debug('standard compile end!');

  }

  // 创建App和Page节点
  createAppAndPage() {
    let {projectRoot} = this.options;
    let root = this.projectGraph = this.createNode({
      realPath: path.join(this.options.projectRoot, 'src/app/app.cml'),
      nodeType: this.nodeType.App
    })
    this.compileQueue.push(root);

    let {hasError, routerConfig} = this.getRouterConfig();
    if (!hasError) {
      let routes = routerConfig.routes;
      routes.forEach(route => {

        let cmlFilePath = path.join(projectRoot, 'src', route.path + '.cml');
        if (cmlUtils.isFile(cmlFilePath)) {
          let pageNode = this.createNode({
            realPath: cmlFilePath,
            nodeType: this.nodeType.Page
          })
          root.dependencies.push(pageNode)
        }
      })

    }

  }

  // 路由变化何时要触发编译
  getRouterConfig() {
    let {projectRoot} = this.options;
    // 有配置路由文件，给app.json添加pages
    let routerConfigPath = path.join(projectRoot, 'src/router.config.json');
    let routerConfig = {};
    let hasError = false;
    try {
      let content = this.readFileSync(routerConfigPath);
      content = this.utf8BufferToString(content);
      routerConfig = JSON.parse(content);
    } catch (e) {
      hasError = true;
    }
    return {
      hasError,
      routerConfig
    };
  }


  async compileNode(currentNode) {
    if (currentNode.compiled) {
      return;
    }
    this.oneLoopCompiledNode.push(currentNode);
    this.log.debug('standard compiled node: ' + currentNode.identifier)
    switch (currentNode.nodeType) {
      case this.nodeType.App:
        await this.compileCMLFile(currentNode)
        break;
      case this.nodeType.Page:
        await this.compileCMLFile(currentNode)
        break;
      case this.nodeType.Component:
        await this.compileCMLFile(currentNode)
        break;
      case this.nodeType.Module:
        await this.compileModule(currentNode);
        break;
      default:
        throw new Error('not find nodeType '+ currentNode.nodeType);
    }
    // 实现层级编译
    // 子模块的编译
    if (currentNode.childrens && currentNode.childrens.length > 0) {
      for (let i = 0; i < currentNode.childrens.length; i++) {
        this.compileQueue.push(currentNode.childrens[i]);
      }
    }
    // 依赖节点的编译
    if (currentNode.dependencies && currentNode.dependencies.length > 0) {
      for (let i = 0; i < currentNode.dependencies.length; i++) {
        this.compileQueue.push(currentNode.dependencies[i]);
      }
    }

    currentNode.compiled = true;

  }

  readNodeSource(currentNode) {
    let buf = this.readFileSync(cmlUtils.delQueryPath(currentNode.realPath));
    currentNode.ext = path.extname(currentNode.realPath);
    if (this.stringExt.test(currentNode.ext)) {
      buf = this.utf8BufferToString(buf);
    }
    currentNode.source = buf;
  }

  readFileSync(...args) {
    return this.inputFileSystem.readFileSync.apply(this.inputFileSystem, args);
  }
  compileCMLFile(currentNode) {
    let realPath = currentNode.realPath;
    let content = currentNode.source;
    let parts = cmlUtils.splitParts({content});

    if (parts.template && parts.template[0]) {
      let item = parts.template[0];
      let newNode = this.createNode({
        realPath,
        nodeType: this.nodeType.Module,
        moduleType: this.moduleType.Template,
        source: item.content
      })
      newNode.attrs = item.attrs;
      newNode.parent = currentNode;
      currentNode.childrens.push(newNode);
    }

    if (parts.script && parts.script.length > 0) {
      parts.script.forEach(item => {
        let moduleType = item.cmlType === 'json' ? this.moduleType.Json : this.moduleType.Script;
        let newNode = this.createNode({
          realPath,
          nodeType: this.nodeType.Module,
          moduleType,
          source: item.content
        })
       
        newNode.attrs = item.attrs;
        newNode.parent = currentNode;
        currentNode.childrens.push(newNode);
      })
    }

    if (parts.style && parts.style[0]) {
      let item = parts.style[0];
      let newNode = this.createNode({
        realPath,
        nodeType: this.nodeType.Module,
        moduleType: this.moduleType.Style,
        source: item.content
      })
      newNode.attrs = item.attrs;
      newNode.parent = currentNode;
      currentNode.childrens.push(newNode);
    }
  }

  async compileModule(currentNode) {
    switch (currentNode.moduleType) {
      case this.moduleType.Template:
        await this.compileTemplate(currentNode);
        break;
      case this.moduleType.Style:
        await this.compileStyle(currentNode);
        break;
      case this.moduleType.Script:
        await this.compileScript(currentNode);
        break;
      case this.moduleType.Json:
        await this.compileJson(currentNode);
        break;
      case this.moduleType.Assets:
        await this.compileAsset(currentNode);
        break;
      case this.moduleType.Other:
      //   await this.compileOther(currentNode);
        break;
      default:
        throw new Error('not find compile Module Type ' + currentNode.moduleType)

    }
  }

  async compileTemplate(currentNode) {
    let {convert, output} = await CMLParser.standardParser({
      source: currentNode.source,
      lang: currentNode.attrs.lang
    });
    currentNode.convert = convert;
    currentNode.output = output;
  }

  async compileStyle(currentNode) {
    let {output, imports} = await CMSSParser.standardCompile({
      source: currentNode.source,
      filePath: currentNode.realPath,
      cmlType: this.options.cmlType,
      lang: currentNode.attrs.lang,
      compiler: this
    });

    currentNode.output = output;

    imports.forEach(item => {
      let newNode = this.createNode({
        realPath: item,
        nodeType: this.nodeType.Module,
        moduleType: this.moduleType.Style
      })
      currentNode.devDependencies.push(newNode);
    })
  }
  async compileScript(currentNode) {
    let self = this;
    let { cmlType, media, config} = this.options;
    let {source, devDeps} = await JSParser.standardParser({
      cmlType,
      media,
      source: currentNode.source,
      filePath: currentNode.realPath,
      check: config.check,
      resolve: this.resolve
    });

    for (let i = 0; i < devDeps.length; i++) {
      let dependPath = devDeps[i];
      let dependNode = self.createNode({
        realPath: dependPath,
        nodeType: self.nodeType.Module
      })
      currentNode.devDependencies.push(dependNode);
    }
    let result = await JSParser.JSCompile({source, filePath: currentNode.realPath, compiler: this});

    currentNode.convert = result.ast;
    for (let i = 0;i < result.dependencies.length;i++) {
      let dependPath = result.dependencies[i];
      let dependNode = self.createNode({
        realPath: dependPath,
        nodeType: self.nodeType.Module
      })
      currentNode.dependencies.push(dependNode);
    }

  }

  async compileJson(currentNode) {
    let {cmlType, projectRoot} = this.options;
    let jsonObject;
    try {
      jsonObject = JSON.parse(currentNode.source);
    } catch (e) {
      this.log.warn(`The .json file corresponding to :${currentNode.realPath} is not correct`);
    }
    jsonObject = jsonObject || {};
    if (currentNode.ext === '.cml') {
      let targetObject = jsonObject[cmlType] || {};
      if (jsonObject.base) {
        targetObject = cmlUtils.merge(jsonObject.base, targetObject)
      }
      currentNode.convert = targetObject;

      targetObject.usingComponents = targetObject.usingComponents || {};
      Object.keys(targetObject.usingComponents).forEach(key => {
        let comPath = targetObject.usingComponents[key];
        let { filePath } = cmlUtils.handleComponentUrl(projectRoot, cmlUtils.delQueryPath(currentNode.realPath), comPath, cmlType);
        if (cmlUtils.isFile(filePath)) {
          let nodeType = this.nodeType.Module;
          if (path.extname(filePath) === '.cml') {
            nodeType = this.nodeType.Component;
          }
          let subNode = this.createNode({
            realPath: filePath,
            nodeType
          })
          currentNode.parent.dependencies.push(subNode);
          this.compileQueue.push(subNode);
        } else {
          this.log.error(`can't find component:${comPath} in ${currentNode.realPath} `);
        }
      })
    } else if (currentNode.ext == '.json') {
      currentNode.convert = jsonObject;
    }
  }

  async compileAsset(currentNode) {
    let realPath = currentNode.realPath;
    if (cmlUtils.isInline(realPath)) {
      currentNode.output = `module.exports = ${JSON.stringify(this.getPublicPath(realPath)
      )}`
    }
  }

  // 用户想要添加文件依赖触发watch重新编译 需要给node添加依赖createNode创建节点
  createNode({realPath, source, nodeType, moduleType}) {
    this.fileDependencies.add(cmlUtils.delQueryPath(realPath));

    let attrs;
    if (nodeType === this.nodeType.Module) {
      if (!moduleType) {
        this.moduleRule.forEach(rule => {
          if (rule.test.test(realPath)) {
            moduleType = rule.moduleType;
            attrs = rule.attrs;
          }
        })
        moduleType = moduleType || this.moduleType.Other;
      }
    } else {
      moduleType = null;
    }
    let key = moduleType === null ? `${nodeType}_${realPath}` : `${nodeType}_${moduleType}_${realPath}`;

    /*
    缓存判断 1 同一个文件节点不重复创建 compileNode时 compiled为true
    有文件 并且mtime 都相同 证明依赖的文件都没有改动  否则删除缓存
    */
    if (this.graphNodeMap[key]) {
      // 如果是cml文件的children则判断父节点是否有变化
      let targetNode = this.graphNodeMap[key].parent ? this.graphNodeMap[key].parent : this.graphNodeMap[key];
      if (targetNode.notChange(this.fileTimestamps)) {
        let fileDeps = targetNode.getDependenciesFilePaths();
        fileDeps.forEach(item => this.fileDependencies.add(item));
        return this.graphNodeMap[key];
      }
    }
    // if (this.graphNodeMap[key] && this.graphNodeMap[key].notChange(this.fileTimestamps)) {
    //   let fileDeps = this.graphNodeMap[key].getDependenciesFilePaths();
    //   fileDeps.forEach(item => this.fileDependencies.add(item));
    //   return this.graphNodeMap[key];
    // }

    let newNode = new CMLNode({
      realPath,
      nodeType,
      moduleType,
      attrs,
      identifier: key
    })

    // js模块的模块类型
    if (~["JS", 'ASSET'].indexOf(moduleType)) {
      let modId = this.createModId(realPath);
      newNode.modId = modId;
      newNode.jsType = 'AMD';
    }
    let noQueryPath = cmlUtils.delQueryPath(realPath);
    newNode.mtime = fs.statSync(noQueryPath).mtime.getTime();
    newNode.ext = path.extname(noQueryPath);
    if (source) {
      newNode.source = source;
    } else {
      this.readNodeSource(newNode);
    }
    this.graphNodeMap[key] = newNode;
    return newNode;
  }

  createModId(realPath) {
    let modId = realPath;
    if (~realPath.indexOf(this.options.projectRoot)) {
      modId = path.relative(this.options.projectRoot, realPath);
    } else if (~realPath.indexOf(this.options.cmlRoot)) {
      modId = path.relative(this.options.cmlRoot, realPath);
    }
    return modId;
  }
  // 根据资源路径 返回base64或者publicPath
  getPublicPath(filePath) {
    let publicPath = this.options.config.output.publicPath;
    let mimetype = mime.getType(filePath);
    let buf = this.readFileSync(cmlUtils.delQueryPath(filePath));
    let result = '';
    if (cmlUtils.isInline(filePath)) {
      result = `data:${mimetype || ''};base64,${buf.toString('base64')}`
    } else {
      if (typeof publicPath === 'function') {
        return publicPath(filePath);
      } else {
        // let modId = this.createModId(filePath);
        let hash = cmlUtils.createMd5(buf);
        if (publicPath[publicPath.length - 1] !== '/') {
          publicPath = publicPath + '/';
        }
        let assetsPath = this.assetsPath;
        if (assetsPath[0] === '/') {
          assetsPath = assetsPath.slice(1);
        }
        let splitName = cmlUtils.splitFileName(filePath);
        result = publicPath + assetsPath;
        let replaceMap = {
          filename: splitName[0],
          ext: splitName[1],
          hash
        }
        result = result.replace(/\$\{(.*?)\}/g, function(all, $1) {
          return replaceMap[$1];
        })
        return result;
      }
    }

  }

  // 开启用户自定义编译
  async customCompile() {
    // 队列串行编译
    // while (this.oneLoopCompiledNode.length) {
    //   let currentNode = this.oneLoopCompiledNode.shift();
    //   let key = currentNode.moduleType === null ? `compile-${currentNode.nodeType}` : `compile-${currentNode.nodeType}-${currentNode.moduleType}`;
    //   this.emit(key, currentNode);
    //   // AMD模块包装
    //   if (~[this.moduleType.Script, this.moduleType.Asset].indexOf(currentNode.moduleType) && currentNode.jsType === 'AMD') {
    //     AMDWrapper({compiler: this, currentNode})
    //   }
    // }

    //  递归编译
    this.customCompileNode(this.projectGraph);
  }

  customCompileNode(currentNode) {
    // 存在这个节点
    let index = this.oneLoopCompiledNode.indexOf(currentNode);
    if (index !== -1) {
      // console.log('custom compile' + currentNode.moduleType + currentNode.realPath)
      // 先删除 保证之编译一次
      this.oneLoopCompiledNode.splice(index, 1);
      if (~[this.nodeType.App, this.nodeType.Page, this.nodeType.Component].indexOf(currentNode.nodeType)) {
        this.log.debug('custom compile preCML:' + currentNode.nodeType + '_' + currentNode.realPath);

        this.emit(`preCML`, currentNode, currentNode.nodeType);
      } else {
        // Template Script Style Json
        this.log.debug('custom compile '+ currentNode.moduleType + ':' + currentNode.realPath);

        this.emit(currentNode.moduleType, currentNode);
        // AMD模块包装
        if (~[this.moduleType.Script, this.moduleType.Asset].indexOf(currentNode.moduleType) && currentNode.jsType === 'AMD') {
          AMDWrapper({compiler: this, currentNode})
        }
      }
      currentNode.childrens.forEach(item => {
        this.customCompileNode(item);
      })

      currentNode.dependencies.forEach(item => {
        this.customCompileNode(item);
      })

      if (~[this.nodeType.App, this.nodeType.Page, this.nodeType.Component].indexOf(currentNode.nodeType)) {
        this.log.debug('custom compile postCML:' + currentNode.nodeType + '_' + currentNode.realPath);
        this.emit(`postCML`, currentNode, currentNode.nodeType);
      }
    }
  }

  utf8BufferToString(buf) {
    var str = buf.toString("utf-8");
    if (str.charCodeAt(0) === 0xFEFF) {
      return str.substr(1);
    } else {
      return str;
    }
  }
}

module.exports = Compile;
