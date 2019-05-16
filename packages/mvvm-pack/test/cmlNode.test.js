
var CMLNode = require('../cmlNode.js')

const expect = require('chai').expect;

describe('cmlNode', function() {
  it('constructor', function() {
    var cmlNode = new CMLNode({
      ext: '.cml',
      realPath : 'realPath', // 文件物理地址
      nodeType : 'nodeType', // app/page/component/module // 节点类型     app/page/component  其他的为module  cml文件中的每一个部分也是一个Node节点
      moduleType: 'moduleType',// template/style/script/json/asset
      dependencies: ['dependencies'], // 该节点的直接依赖       app.cml依赖pages.cml pages.cml依赖components.cml js依赖js
      childrens : ['dependencies'], // 子模块 cml文件才有子模块
      parent: 'parent', // 父模块 cml文件中的子模块才有
      source: 'source', // 模块源代码
      convert: 'convert', // 源代码的格式化形式
      output: 'output', // 模块输出  各种过程操作该字段
      identifier: 'identifier', // 节点唯一标识
      modId: 'modId', // 模块化的id requirejs
      extra: 'extra' // 节点的额外信息
    })
    expect(cmlNode.ext).to.be.equal('.cml')
    expect(cmlNode.realPath).to.be.equal('realPath')
  })
 
})
