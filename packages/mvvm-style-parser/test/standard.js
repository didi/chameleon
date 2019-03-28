let standard = require('../lib/standardCompile.js');

const source = `
.class1 {
  background: url(./images/1.png) no-repeat;
}
@font-face{
  font-family: 'YaHei Consolas Hybrid';
  src : url('./fonts/test.ttf');
}
`

const mvvmpack = require('../../mvvm-pack/index.js');
const path = require('path');

let compiler = new mvvmpack({
  config: {
    check: {
      enable: true, // 是否开启接口校验
      enableTypes: [] // 接口校验支持的类型 可以开启["Object","Array","Nullable"]
    },
    output: {
      publicPath: 'http://static.cml.com/static/'
    }
  },
  logLevel: 3,
  cmlType: 'web',
  media: 'dev',
  cmlRoot: path.resolve('./'),
  projectRoot: path.resolve(__dirname, './')
})

let result = standard({ cmlType: 'web', lang: 'less', source, filePath: path.join(__dirname, './assetsCompile.js'), compiler});

console.log(result.output)
console.log(result.imports)

