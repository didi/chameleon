class CMLNode {
  constructor(options = {}) {
    this.ext;
    this.realPath; // 文件物理地址
    this.nodeType; // app/page/component/module // 节点类型     app/page/component  其他的为module  cml文件中的每一个部分也是一个Node节点
    this.moduleType; // template/style/script/json/asset
    this.dependencies = []; // 该节点的直接依赖       app.cml依赖pages.cml pages.cml依赖components.cml js依赖js
    this.childrens = []; // 子模块 cml文件才有子模块
    this.parent; // 父模块 cml文件中的子模块才有
    this.source; // 模块源代码
    this.convert; // 源代码的格式化形式
    this.output; // 模块输出  各种过程操作该字段
    this.identifier; // 节点唯一标识
    this.modId; // 模块化的id requirejs
    this.extra; // 节点的额外信息
    Object.keys(options).forEach(key => {
      this[key] = options[key];
    })
  }
}

module.exports = CMLNode;
