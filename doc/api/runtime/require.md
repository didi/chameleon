# require
require 属于运行时加载方案命令，支持导入的文件类型同`import`

#### require 适用的场合
（1）条件加载
import()可以放在if代码块，根据不同的情况，加载不同的模块。
```javascript
let module
if (condition) {
  module = require('moduleA')
} else {
  module = require('moduleB')
}
```

（2）动态的模块路径
```javascript
const m = require(f())
```

 (3) 返回图片线上资源地址
 ```javascript
 let imgPath

if (condition) {
  imgPath = '../../imgs/iconA.png'
} else {
  imgPath = '../../imgs/iconB.png'
}

let imgSrc = require(imgPath)
 ```
