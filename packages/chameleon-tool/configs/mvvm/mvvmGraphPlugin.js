
const CMLNode = require('./cmlNode.js');
const path = require('path');
class mvvmGraphPlugin {
  constructor() {
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
    
  }
  apply(compiler) {
    let self = this;
    compiler.plugin('should-emit', function(compilation) {
      let outPutFile = {}; // 输出文件 key为文件路径 value为输出文件内容

      let modules = compilation.modules;
      let appModule;
      for (let i = 0; i < modules.length; i++) {
        if (modules[i]._nodeType === 'app') {
          appModule = modules[i];
        }
        // 静态资源的写入
        if (modules[i]._nodeType === 'module' && modules[i]._moduleType === 'asset') {
          if (modules[i]._assetSource && modules[i]._outputPath) {
            outPutFile[modules[i]._outputPath] = modules[i]._assetSource;
          }
        }
      }

      if (!appModule) {
        throw new Error('not find app.cml node!')
      }

      let moduleNodeMap = new Map();
      // appModule
      let mvvmGraph = self.createGraph(appModule, null, moduleNodeMap);
      return false;
      
    })
    compiler.plugin('done', function(compilation) {
      debugger
      
    })
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
        if (moduleNodeMap.has(item.module)) {

          let subNode = moduleNodeMap.get(item.module);
          if (subNode.realPath === currentNode.realPath) {
            subNode.parent = currentNode;
            currentNode.childrens.push(subNode);
          } else {
            currentNode.dependencies.push(subNode);
          }

        } else {
          let subNode = this.createNode(item.module);
          moduleNodeMap.set(item.module, subNode);
          if (subNode.realPath === currentNode.realPath) {
            subNode.parent = currentNode;
            currentNode.childrens.push(subNode);
          } else {
            currentNode.dependencies.push(subNode);
          }
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

      if (module._moduleType) {
        options.moduleType = module._moduleType;
      } else {
        this.moduleRule.forEach(rule => {
          if (rule.test.test(module.resource)) {
            options.moduleType = rule.moduleType;
          }
        })
        options.moduleType = options.moduleType || 'other';
      }
      
      options.source = module._cmlSource || module._source && module._source._value;
    }
    return new CMLNode(options)
  }
}

module.exports = mvvmGraphPlugin;