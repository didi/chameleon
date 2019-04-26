
const templateParser = require('./templateParser.js');
const styleParser = require('./styleParser.js');
const cmlUtils = require('chameleon-tool-utils');
const path = require('path');
module.exports = class DemoPlugin {
  constructor(options) {
    let { cmlType, media} = options;
    this.webpackRules = []; // webpack的rules设置  用于当前端特殊文件处理
    this.moduleRules = []; // 文件后缀对应的节点moduleType  
    this.logLevel = 3;
    this.originComponentExtList = ['.ddml'];
    this.runtimeNpmName = 'cml-demo-runtime';
    this.runtimeNeedComponents = false; 
    this.cmlType = cmlType;
    this.media = media;
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
      // debugger
      currentNode.output = compiler.amd.amdWrapModule({content:currentNode.source, modId:currentNode.modId});
    })

    /**
     * 编译template节点 语法转义
     * currentNode 当前节点
     * parentNodeType 父节点的nodeType
     */
    compiler.hook('compile-template', function(currentNode, parentNodeType) {
        currentNode.output = templateParser(currentNode.source)
    })

    /**
     * 编译style节点  比如尺寸单位转义
     * currentNode 当前节点
     * parentNodeType 父节点的nodeType
     */
    compiler.hook('compile-style', function(currentNode, parentNodeType) {
      currentNode.output = styleParser(currentNode.source);
    })

    /**
     * 编译json节点
     * currentNode 当前节点
     * parentNodeType 父节点的nodeType
     */
    compiler.hook('compile-json', function(currentNode, parentNodeType) {
      currentNode.output = currentNode.source;
    })

    /**
     * 编译other类型节点
     * currentNode 当前节点
     */
    compiler.hook('compile-other', function(currentNode) {

    })




    /**
     * 编译结束进入打包阶段
     */
    compiler.hook('pack', function(projectGraph) {
      // 遍历编译图的节点，进行各项目的拼接
      let hasCompiledNode = [];
      

      let bootstrapCode = compiler.amd.getModuleBootstrap();
      compiler.writeFile('/static/js/manifest.js', bootstrapCode);
      let commonjsContent = `let {cmldefine} = require('./common.js')`;
      // 遍历节点
      outputNode(projectGraph);
      compiler.writeFile('/static/js/common.js', commonjsContent);
      function outputNode(currentNode) {
        if (~hasCompiledNode.indexOf(currentNode)) {
          return;
        }
        hasCompiledNode.push(currentNode);

        if(currentNode.nodeType === 'app') {
          currentNode.childrens.forEach(item=>{
            if(item.moduleType === 'json') {
              debugger
              compiler.writeFile('/app.json',item.output, '', 4)
            } else if(item.moduleType === 'style') {
              compiler.writeFile('/app.wxss', item.output)
            } else if(item.moduleType === 'script') {
              let jsContent = `let {cmldefine, cmlrequire} = require('./static/js/manifest.js');\n` +
              `cmlrequire('${item.modId}')`;
              let jsPath = '/app.js';
              compiler.writeFile(jsPath, jsContent);

            }
            outputNode(item);
          })
          
        }
  
        if(~['page','component'].indexOf(currentNode.nodeType)) {
          currentNode.childrens.forEach(item=>{
            let entryName = cmlUtils.getPureEntryName(item.realPath, self.cmlType, cml.projectRoot);
            if(item.moduleType === 'json') {

              compiler.writeFile(`/${entryName}.json`, item.output, '', 4)
            } else if(item.moduleType === 'style') {
              compiler.writeFile(`/${entryName}.wxss`, item.output)
            } else if(item.moduleType === 'template') {
              compiler.writeFile(`/${entryName}.wxml`, item.output)
            } else if(item.moduleType === 'script') {
              let relativePath;
              let pureResourcePath = cmlUtils.delQueryPath(item.realPath);

              if (~pureResourcePath.indexOf('node_modules')) {
                relativePath = path.relative(pureResourcePath, path.join(cml.projectRoot, 'node_modules'));
              } else {
                relativePath = path.relative(pureResourcePath, path.join(cml.projectRoot, 'src'));
                if (relativePath == '..' || relativePath == '.') {
                  relativePath = ''
                } else {
                  relativePath = relativePath.slice(3);
                }
              }
              relativePath = cmlUtils.handleWinPath(relativePath);

              let jsFileName = cmlUtils.getEntryPath(pureResourcePath, cml.projectRoot);
              jsFileName = cmlUtils.handleWinPath(jsFileName);
              let array = jsFileName.split('/');
              let basename = array[array.length-1].split('.')[0] + '.js';
              jsFileName = [].concat(array.slice(0,-1),basename).join('/');
              let content = `let {cmldefine, cmlrequire} = require('${relativePath}/static/js/manifest.js')\n`;
              content += `require('${relativePath}/static/js/common.js')\n`;
              content += `cmlrequire('${item.modId}')\n`;
              compiler.writeFile(jsFileName, content)
            }
            outputNode(item);
          })
        }

        if(currentNode.nodeType === 'module' && currentNode.moduleType === 'script') {
          commonjsContent += currentNode.output;
        }
  
        currentNode.dependencies.forEach(item => {
          outputNode(item);
        })
      }
    })

}
}