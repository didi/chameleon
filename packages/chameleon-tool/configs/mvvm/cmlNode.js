class CMLNode {
  constructor(options = {}) {
    this.ext;
    this.realPath; // 文件物理地址
    this.nodeType; // App/Page/Component/Module // 节点类型     CML文件分为App/Page/Component  其他的为Module  CML文件中的每一个部分也是一个Node节点
    this.moduleType; // template/style/script/json/asset   CML为CML文件
    this.dependencies = []; // 该节点的直接依赖编译及诶点        app.cml依赖pages.cml pages.cml依赖components.cml js依赖js cmss依赖cmss
    this.devDependencies = []; // 该节点的编译依赖的文件 该文件改动会触发重新编译  但是这个文件本身是不需要单独编译
    this.childrens = []; // 子模块 CML才有子模块
    this.parent; // 父模块 CML文件中的子模块才有
    this.source; // 模块源代码
    this.convert; // AST  JSON
    this.output; // 模块输出  各种过程操作该字段
    this.attrs; // template/style/script/json模块上的属性
    this.compiled; // 是否经过编译
    this.extra; // 用户可以额外添加的信息
    this.mtime; // 文件修改时间
    this.identifier; // 节点唯一标识 由 nodeType moduleType realPath组成
    this.modId; // script 与asset模块的id 用于amd包装
    Object.keys(options).forEach(key => {
      this[key] = options[key];
    })
  }
}

module.exports = CMLNode;
