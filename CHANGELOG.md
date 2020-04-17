## [1.0.6-alpha.1]

* 升级less编译器
* 支持原生组件样式引入对应平台样式文件不带后缀
* 支持路由多平台配置

## [1.0.5]

* 发布支持头条和小程序增强相关能力的正式版本
* 预览页面改版，支持预览页面搜索能力

## [1.0.5-alpha.2]

* 全局配置支持小程序云开发
* 支持小程序插件使用和插件开发
* 支持微信小程序sitemap配置
* 命令行内置支持头条小程序
* 支持头条小程序端语法校验


## [1.0.5-alpha.1]
 
  - 支持全局样式
  - 修复config.json缺少qq和扩展新端信息
  - 优化全局配置，支持性能优化配置项
  - 配置不引入基础样式，小程序端不生成对应样式文件
  - 修复语法校验中stylus、component 校验逻辑报错
## [1.0.4]
  - 支持mock文件更新实时重新编译
  - 支持分包页面依赖的js更新，打包结果重新编译
  - 优化dev模式内存占用
  - 修复分包模式下组件js抽离的时候重复对页面js抽离的操作

## [1.0.4-alpha.2]
  - 扩展新端增加内置环境变量 NODE_ENV
  - 支持模板多态语法

## [1.0.4-alpha.1]

  - 解决分包内组件js分包不彻底，优化包体积40%左右
  - 支持原生小程序组件的导入也是函数式的
  - 支持公用样式以文件的形式 @import

## [1.0.3]

- 发布1.0.3-alpha.0的正式版

## [1.0.3-alpha.0]
- Bugfixes
  - 区分web端click和tap事件，由原来的click和tap统一处理成tap，改为tap和click区别对待，如果要在pc端生效click事件，那么必须绑定click而非tap
  - 修复windows 上 app.json 中分包页面没有删除
  - 修复windows 上初始化项目无法运行
- Features
  - 扩展新端命令支持集成到chameleon-tool中
## [1.0.2]

 - 修改project tododemo的package.lock.json

## [1.0.0]

### Bugfixes
   - 修复alipay baidu qq 端引用原生组件的问题
   
## [0.4.1]
### Bugfixes
   - 修复内联事件对象 $event的匹配问题
   - 修复chameleon.config.js内部配置公用miniappConfig一个对象导致的对象合并不准确问题
## [0.4.1-alpha.1]
### Bugfixes
   - 修复window下分包加载的bug
   - 修复babel-loader无法在回调插件中重新配置的bug
## [0.4.1-alpha.0]

### Bug Fixes

- 修复 config.json文件中不生成extra
- 修复 -h 指令提示 -n 的情况

## [0.4.0]
### Features
- 灰度完成发正式版
  
## [0.4.0-alpha.2]
### Features
- 合并0.3.3 和 mvvm+ 版本的代码

## [0.4.0-mvvm.16]

### Bug Fixes
- 修复扩展新端运行时代码插入

## [0.4.0-mvvm.15]

### Bug Fixes
- 修复扩展新端代码中无法使用async函数

## [0.4.0-mvvm.13]

### Bug Fixes
- 修复扩展新端用户编译插件报错导致阻塞watch
- 修复扩展新端中不支持变量注入的bug

## [0.4.0-mvvm.12]

### Features
- 支持给扩展新端自定义loader传默认options

### Bug Fixes
- 修复多路由报错的bug

## [0.4.0-mvvm.11]
### Features
- 增加生成config.json文件的钩子
- 打包文件增量覆盖
- 新端插件中可以有默认配置
- 静态资源可以添加生成路径前缀

## [0.4.0-mvvm.10]
### Features
- 完善mvvm-pack单元测试
- 扩展新端compiler对象新增获取路由方法
- 扩展新端cml节点的extra字段添加引用组件

## [0.4.0-mvvm.9]
### Features
- 支持script类型节点 originSource字段获取节点babel前代码
- linter支持扩展多态协议的校验

## [0.4.0-mvvm.8]
### Bug Fixes
- 修复扩展新端在window上构建报错
## [0.4.0-mvvm.7]
### Features
- 支持扩展新端支持文件指纹与js和css压缩
- 对齐百度和微信小程序能力，支持 支付宝 web weex 在自定义组件上使用 tap touchstart touchend touchcancel原生事件直接触发

## [0.4.0-mvvm.6]
### Features
- 支持扩展新端对小程序原生组件支持

## [0.4.0-mvvm.1-0.4.0-mvvm.3]
### Features
- 增加 扩展新端功能
- 增加 web端组件导出支持externals参数进行运行时分离
- 增加 支持小程序配置原生tabbar

## [0.3.3]
### Features:
  - 组件导出依赖分离
  - 可通过命令行配置 preview 预览页是否打开
  - 合并qq小程序分支
  - web端原生origin click事件不处理成tap
  - 修改全局变量校验失效问题，同时增加 qq 全局变量名单。
  - 模板变量校验添加 LogicalExpression 处理逻辑表达式里的变量
  - 支持以组件、页面、子项目粒度配置是否注入默认样式
### Bug Fixes
  - 修改cover-view报未定义组件问题件
  - 修复引入zepto库后tap事件触发两次问题
## [0.3.3-alpha.6]
### Features
  - 组件导出依赖分离
  - 可通过命令行配置 preview 预览页是否打开
  
## [0.3.3-alpha.5]
### Features
  - 合并qq小程序分支
  - web端原生origin click事件不处理成tap
  
## [0.3.3-alpha.4]
### Features
  - 修改全局变量校验失效问题，同时增加 qq 全局变量名单。
  - 模板变量校验添加 LogicalExpression 处理逻辑表达式里的变量
### Bug Fixes
  - 修改cover-view报未定义组件问题件
  - 修复引入zepto库后tap事件触发两次问题
  
## [0.3.3-alpha.3]
### Features
  - 支持web weex可配置是否包裹组件

## [0.3.3-alpha.qq.1]
### Features
* 支持qq小程序
  旧项目支持qq小程序 需要修改的地方
  - 1 升级以下几个npm包版本
    "chameleon-api": "0.5.0-alpha.6",
    "chameleon-bridge": "0.2.0-alpha.5",
    "chameleon-runtime": "0.2.2-alpha.qq",
    "chameleon-store": "0.1.0-alpha.qq",
    "chameleon-ui-builtin": "0.2.11-alpha.qq",
    "cml-ui": "0.2.0-alpha.qq"
  - 2 chameleon.config.js中`platforms`字段添加`qq`
  - 
## [0.3.3-alpha.2]

### Bug Fixes 

* 修复 weex dev模式liveload失效
  老项目如果修复，还需要升级项目中两个npm包如下：
  - "chameleon-api": "0.4.17",
  - "chameleon-bridge": "0.1.10",
* weex babelPolyfill为true时 将添加整个@babel/polyfill修改为只添加几个polyfill方法<a href="https://github.com/didi/chameleon/blob/v0.3.x-alpha/packages/chameleon-tool/configs/default/miniappPolyfill.js">miniappPolyfill.js</a>
## [0.3.3-alpha.1]
  - 支持小程序分包加载
  - 修复windows 路径带有数字无法运行
  - 升级webpack-bundle-analyzer 解决安全漏洞警告
## [0.3.3-alpha.0]
- web/weex样式一致性加强
- 基础样式设置支持不导入
- 修复 vue 语法下 v-for bug
- 支持在cml组件上绑定原生事件，注意：需要升级chameleon-ui-builtin到0.2.10-alpha.4版本才支持
- 修复weex内联事件传汉字编译过慢；
- 支持组件上绑定多个内联事件传参的情况

## [0.3.2]

###  Bug Fixes
* 修复 web端模板错误

## [0.3.1] 
有bug

## [0.3.0]
0.3.0-alpha.9 灰度为正式版本

## [0.3.0-alpha.9](https://github.com/didi/chameleon/compare/v0.3.0-alpha.8...v0.3.0-alpha.9)

###  Bug Fixes
* 修复 cml build 命令 不配置web端也会进行web端构建的bug

###  0.3.0-alpha.8 灰度完成发布0.3.0版本


## [0.3.0-alpha.8](https://github.com/didi/chameleon/compare/v0.3.0-alpha.7...v0.3.0-alpha.8)

###  Bug Fixes
* 修复 全局安装chameleon-tool时的npm warn


## [0.3.0-alpha.7](https://github.com/didi/chameleon/compare/v0.3.0-alpha.6...v0.3.0-alpha.7)

###  Bug Fixes
* 修复 build 模式autoprefixer被删除
* 修复 chameleon.config.js 中的base配置优先级bug


### Features
* 增加了cmss.enableAutoPrefix 参数控制是否添加css的autoprefix


## [0.3.0-alpha.6](https://github.com/didi/chameleon/compare/v0.3.0-alpha.5...v0.3.0-alpha.6)

###  Bug Fixes
* 修复 cml wx build执行后报错


## [0.3.0-alpha.5](https://github.com/didi/chameleon/compare/v0.3.0-alpha.4...v0.3.0-alpha.5)

###  Bug Fixes
* 修复 cml weex build生成config.json 格式不正确


## [0.3.0-alpha.4](https://github.com/didi/chameleon/compare/v0.3.0-alpha.3...v0.3.0-alpha.4)

###  Bug Fixes
* 回退模板的chameleon-ui-builtin@0.2.1 到chameleon-ui-builtin@0.2.0， 因为image组件不兼容样式设置


## [0.3.0-alpha.3](https://github.com/didi/chameleon/compare/v0.3.0-alpha.2...v0.3.0-alpha.3)

### Features
* 升级初始化项目运行时依赖
* weex config.json中增加md5字段

### Bug Fixes
* 组件间css优先级问题

## [0.3.0-alpha.2](https://github.com/didi/chameleon/compare/v0.3.0-alpha.1...v0.3.0-alpha.2)

### Features
* 支持微信wxs 支付宝sjs 百度.filter.js的文件引用  [issues/67](https://github.com/didi/chameleon/issues/67)


## [0.3.0-alpha.1](https://github.com/didi/chameleon/compare/v0.2.0...v0.3.0-alpha.1)

### Bug Fixes
* preview页面iframe未撑开修复
* weex的 build模式jsbundle中存在本地路径

### Features
* 小程序的图片地址本地图片改网络图片
* 解决父级目录babel-loader问题
* build模式config.json的生成
* web端weex端 多态组件支持js格式的vue组件
* 小程序和weex也添加babelPolyfill的选项
* 校验不支持Promise类型定义
* 默认添加/components 别名
* 校验添加生命周期函数白名单
## [0.2.0](https://github.com/didi/chameleon/compare/v0.2.0-alpha.1...v0.2.0)

### Bug Fixes

- 默认开启全局变量校验，升级初始化项目中依赖符合全局变量校验
- linter校验支持component is的校验

## [0.2.0-alpha.1](https://github.com/didi/chameleon/compare/v0.2.0-alpha.0...v0.2.0-alpha.1)

### Bug Fixes

- 修复 js中import css文件导致构建停滞的bug

## [0.2.0-alpha.0](https://github.com/didi/chameleon/compare/v0.1.0-alpha.4...v0.2.0-alpha.0)

### Features

- 优化api多域名mock方式
- 组件间css优先级修复
- chameleon.config.js支持base配置
- cml和vue的语法支持事件冒泡
- vue语法下扩展了 v-on:click.stop="handleClick" 的形式来阻止冒泡
- wx端用户自定义组件不添加 cml-base class
- component is支持事件绑定以及component is上的属性解析
- 支持cml子项目放入node_module中引入
- 支持拷贝node_modules中的小程序子项目

### Bug Fixes

- 修复 组件间css优先级 使父组件可覆盖子组件样式

## [0.1.1](https://github.com/didi/chameleon/compare/v0.1.0-alpha.4...v0.1.1)

### Features

- init component命令提示文案
- init 多态组件中的json部分优化


## [0.1.0-alpha.4](https://github.com/didi/chameleon/compare/v0.1.0-alpha.3...v0.1.0-alpha.4)

### Features

- 终端提示英文化
- 样式隔离，模板包裹，特殊属性被包裹层继承
- 事件处理优化
- 动画和轮播图的模板解析支持
- chameleon-template-parse 单测完善到 90% 以上 增加对模板解析时候语法的校验
- mock多域名请求优化

### Bug Fixes

- 修复component is v-model c-model v-show c-show


## [0.1.0-alpha.3](https://github.com/didi/chameleon/compare/v0.1.0-alpha.2...v0.1.0-alpha.3)

### Bug Fixes

- **chameleon-tool** 修复 alpha版本cli兼容0.1.1版本的chameleon-api ([0deaa8d](https://github.com/didi/chameleon/commit/0deaa8df11f605fc08c1b71850379500ea3f38cc))


## [0.1.0-alpha.2](https://github.com/didi/chameleon/compare/v0.1.0-alpha.1...v0.1.0-alpha.2)

### Bug Fixes

- **chameleon-template-parse** 修复 c-show bug ([4c2c750](https://github.com/didi/chameleon/commit/4c2c7507f2aa906f0580ed59d056e91be7269a93))
- **chameleon-template-parse** 修复 component is bug ([4c2c750](https://github.com/didi/chameleon/commit/4c2c7507f2aa906f0580ed59d056e91be7269a93))
- **chameleon-loader** 修复 window上数字目录编译报错 ([f1b236d](https://github.com/didi/chameleon/commit/f1b236dfe602daf9dd476b9c6e33e980e3640dbc))
- **chameleon-mixins** 修复 百度小程序中动画bug ([ca41f54](https://github.com/didi/chameleon/commit/ca41f5460bc0098ce8b401e4b0fc2baad0ffc254))

## [0.1.0-alpha.1](https://github.com/didi/chameleon/compare/v0.0.12...v0.1.0-alpha.1)

### Features

- 支持百度小程序和支付宝小程序
- 支持mock多域名请求

## [0.0.16](https://github.com/didi/chameleon/compare/v0.0.15...v0.0.16)

### Bug Fixes
* 修复 小程序组件导出 样式文件压缩
* 回退 v0.3.0-alpha.0中引入微信预览模式白屏的问题

## [0.0.13](https://github.com/didi/chameleon/compare/b2aa4b...6dc5ff9#diff-b21d2ccb648a84e2a7348250c471cc2aL32)

### Bug Fixes

- **chameleon-templates** 修复默认初始化项目中的微信app.json默认配置([dc58180](https://github.com/didi/chameleon/commit/dc58180827327bbd966398c57602822992238c1f)）

## [0.0.12](https://github.com/didi/chameleon/compare/v0.0.11...v0.0.12)

### Bug Fixes
- **chameleon-css-loader** 修复低版本浏览器todo demo白屏问题，fix [#3](https://github.com/didi/chameleon/issues/3) ([d565a29](https://github.com/didi/chameleon/commit/d565a292ccef56de5c283cce2debeaca5ee7d722))
- **chameleon-css-loader** 修复不处理第一个样式多态的问题([d565a29](https://github.com/didi/chameleon/commit/d565a292ccef56de5c283cce2debeaca5ee7d722)）
- **chameleon-loader** 修复cml-ui中组件事件不代理的问题([21e0709](https://github.com/didi/chameleon/commit/21e0709353a2635f9055a79009b9d992dfb68f78)）
- **chameleon-templates** 修复todo-demo图片损坏问题([de5b42d](https://github.com/didi/chameleon/commit/de5b42da50e5b7315ce1ad33b82c2e6ed94fe04a)）
- **chameleon-templates** 升级初始化项目依赖版本，fix [#2](https://github.com/didi/chameleon/issues/2) ([75ba521](https://github.com/didi/chameleon/commit/75ba52111634f218a404ca85fe57e448f8ed880a)）

