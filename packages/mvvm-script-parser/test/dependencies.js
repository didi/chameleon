let source = `import a from './a.js'
import {b,c} from './b.js'
import * as d from './c.js'
const e = require('./d.js');
require('./e.js')`


const mvvmpack = require('../../mvvm-pack/index.js');
const path = require('path');

let compiler = new mvvmpack({
  config: {
    check: {
      enable: true, // 是否开启接口校验
      enableTypes: [] // 接口校验支持的类型 可以开启["Object","Array","Nullable"]
    }
  },
  logLevel: 3,
  cmlType: 'web',
  media: 'dev',
  cmlRoot: path.resolve('./'),
  projectRoot: path.resolve(__dirname, '../')
})


let parser = require('../index.js');


let result = parser.JSCompile({source, compiler, realPath: path.join(__dirname, './dependencies.js')})
