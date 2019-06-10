
const path = require('path');
module.exports = class DemoPlugin {
  constructor(options) {
    let { cmlType, media} = options;
    this.webpackRules = []; // webpack的rules设置  用于当前端特殊文件处理
    this.moduleRules = []; // 文件后缀对应的节点moduleType
    this.logLevel = 3;
    this.originComponentExtList = ['.wxml']; // 用于扩展原生组件的文件后缀查找
    this.runtimeNpmName = 'cml-demo-runtime'; // 指定当前端的运行时库
    this.builtinUINpmName = 'cml-demo-ui-builtin'; // 指定当前端的内置组件库
    this.cmlType = cmlType;
    this.media = media;
    this.miniappExt = { // 小程序原生组件处理
      rule: /\.wxml$/,
      mapping: {
        'template': '.wxml',
        'style': '.wxss',
        'script': '.js',
        'json': '.json'
      }
    }
    // 需要压缩文件的后缀
    this.minimizeExt = {
      js: ['.js'],
      css: ['.css', '.wxss']
    }

  }

  /**
   * @description 注册插件
   * @param {compiler} 编译对象
   * */
  register(compiler) {
    let self = this;

    /**
       * cml节点编译前
       * currentNode 当前节点
       * nodeType 节点的nodeType
       */
    compiler.hook('compile-preCML', function(currentNode, nodeType) {

    })

    /**
       * cml节点编译后
       * currentNode 当前节点
       * nodeType 节点的nodeType
       */
    compiler.hook('compile-postCML', function(currentNode, nodeType) {

    })

    /**
       * 编译script节点，比如做模块化
       * currentNode 当前节点
       * parentNodeType 父节点的nodeType
       */
    compiler.hook('compile-script', function(currentNode, parentNodeType) {
    })

    /**
       * 编译script节点，比如做模块化
       * currentNode 当前节点
       * parentNodeType 父节点的nodeType
       */
    compiler.hook('compile-asset', function(currentNode, parentNodeType) {
    })

    /**
       * 编译template节点 语法转义
       * currentNode 当前节点
       * parentNodeType 父节点的nodeType
       */
    compiler.hook('compile-template', function(currentNode, parentNodeType) {
    })

    /**
       * 编译style节点  比如尺寸单位转义
       * currentNode 当前节点
       * parentNodeType 父节点的nodeType
       */
    compiler.hook('compile-style', function(currentNode, parentNodeType) {
    })

    /**
       * 编译json节点
       * currentNode 当前节点
       * parentNodeType 父节点的nodeType
       */
    compiler.hook('compile-json', function(currentNode, parentNodeType) {
    })

    /**
       * 编译other类型节点
       * currentNode 当前节点
       */
    compiler.hook('compile-other', function(currentNode) {

    })

   /**
    * 编译other类型节点
    * currentNode 当前节点
    */
   compiler.hook('config-json', function(jsonObj) {
      jsonObj.name = 'chameleon';
   })

    /**
       * 编译结束进入打包阶段
       */
    compiler.hook('pack', function(projectGraph) {
      compiler.writeFile('static/test1.js', 'dd')
      compiler.writeFile('static/css1.css', '.class1 {color: red;}')
    })

    cml.projectRoot = path.join(__dirname, 'demo-project');
    cml.config = {
      get() {
         return {
         subProject: ['cml-subproject'],
            wx: {
               dev: {
               minimize: true,
               hash: true
               }
            }
         }
      }
    }
    let result = compiler.getRouterConfig();
    console.log(JSON.stringify(result));
  }
}
