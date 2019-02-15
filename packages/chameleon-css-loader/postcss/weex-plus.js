// 为web和小程序提供编译weex为标准的特殊样式

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-weex-plus', function(options) {
  return (root, result) => {
    root.walkDecls((decl, i) => {
      if (decl.prop === 'lines') {
        decl
        const decllist = [
          postcss.decl({prop: 'overflow', value: 'hidden'}),
          postcss.decl({prop: 'text-overflow', value: 'ellipsis'}),
          postcss.decl({prop: 'display', value: '-webkit-box'}),
          postcss.decl({prop: '-webkit-line-clamp', value: 2}),
          postcss.decl({prop: '-webkit-box-orient', value: 'vertical'})
        ];
        decl.parent.append(...decllist)
      }
      // decl.parent.removeChild(decl);
    })
  }
})
