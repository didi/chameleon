# 学习指南
经过上一节快速上手的学习，相信你已经初步体验了chameleon的使用，本节就讲解一下chameleon的学习路线。

## 1 常用命令
`cml init`  快速初始化项目、页面、组件。
`cml dev|build`  启动开发和生产模式的构建，也可以单独启动某一端的构建，例如`cml web|wx|weex dev|build`。

## 2 目录与文件结构


### 项目结构
使用`cml init project` 生成的项目结构如下：

```bash
├── chameleon.config.js                 // 项目的配置文件
├── dist                                // 打包产出目录
├── mock                                // 模拟数据目录
├── node_modules                        // npm包依赖
├── package.json
└── src                                 // 项目源代码
    ├── app                             // app启动入口
    ├── components                      // 组件文件夹
    ├── pages                           // 页面文件夹
    ├── router.config.json              // 路由配置文件
    └── store                           // 全局状态管理
```

### 文件夹和文件
<table>
    <tr>
        <th>文件</th>
        <th>必须</th>
        <th>作用</th>
    </tr>
    <tr>
        <td><a href="../framework/config.html">chameleon.config.js</a></td>
        <td>必须</td>
        <td>项目配置文件</td>
    </tr>
    <tr>
        <td>dist</td>
        <td>必须</td>
        <td>自动生成，用户无需关注。项目编译目标目录</td>
    </tr>
    <tr>
        <td><a href="../framework/mock.html">mock</a></td>
        <td>必须</td>
        <td>数据mock编写文件夹</td>
    </tr>
    <tr>
        <td><a href="https://docs.npmjs.com/files/folders.html#node-modules">node_modules </a></td>
        <td>必须</td>
        <td>自动生成，用户无需关注。npm包安装文件夹</td>
    </tr>
    <tr>
        <td><a href="https://docs.npmjs.com/files/package.json">package.json </a></td>
        <td>必须</td>
        <td>npm包配置文件</td>
    </tr>
    <tr>
        <td>app</td>
        <td>必须</td>
        <td>应用启动入口根文件夹</td>
    </tr>
    <tr>
        <td>components </td>
        <td>必须</td>
        <td>用户组件根文件夹</td>
    </tr>
    <tr>
        <td>pages</td>
        <td>必须</td>
        <td>页面根文件夹</td>
    </tr>
    <tr>
        <td><a href="../framework/router.html">router.config.json</a></td>
        <td>必须</td>
        <td>路由配置文件</td>
    </tr>
    <tr>
        <td><a href="../logic/store.html">store</a></td>
        <td>必须</td>
        <td>数据管理文件夹</td>
    </tr>
</table>



一个CML文件开发的组件由四块内容组成，分别是：

<table>
    <tr>
        <th>标签</th>
        <th>必须</th>
        <th>属性</th>
        <th>作用</th>
    </tr>
    <tr>
        <td><a href="../view/cml.html">template</a></td>
        <td>必须</td>
        <td>lang:<a href="../view/cml.html">cml</a>|<a href="../view/vue.html">vue</a></td>
        <td>提供组件结构、事件绑定、数据绑定、样式绑定</td>
    </tr>
    <tr>
        <td><a href="../logic/logic.html">script</a></td>
        <td>必须</td>
        <td>暂无</td>
        <td>组件逻辑</td>
    </tr>
    <tr>
        <td><a href="../view/cmss.html">style</a></td>
        <td>必须</td>
        <td>lang:less|stylus</td>
        <td>组件样式表</td>
    </tr>
    <tr>
        <td><a href="../framework/json.html">json</a>(使用script标签设置cml-type属性)</td>
        <td>必须</td>
        <td>cml-type:json</td>
        <td>组件配置</td>
    </tr>
</table>

### 3 视图层
模板语法 CMSS语法
### 4 逻辑层
生命周期 
### 5 API
常用api
### 6 组件
内置组件与扩展组件

### 7 工程配置

