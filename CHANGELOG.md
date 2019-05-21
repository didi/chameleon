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

## [0.3.1] 有bug

## [0.3.0]

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

