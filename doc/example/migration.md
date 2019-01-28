# web&weex&小程序 项目迁移cml

项目迁移只要由下面几大块组成：
## 一、项目工程级别

### 1 chameleon项目的安装

#### 1.1 首先全局安装 `chameleon-tool`

```
npm i -g chameleon-tool
```

#### 1.2 新建一个chameleon项目

```
cml init project 
```

#### 1.3 chameleon项目的目录结构

各个目录以及文件简单介绍如下

`chameleon-project`目录下：

```javascript
.
├── chameleon.config.js //chameleon项目的配置文件
├── dist				//chameleon项目build的文件
│   ├── web
│   └── wx
├── mock				//chameleon项目的mock
│   ├── api
│   └── template
├── node_modules		//chameleon项目默认依赖
│   ├── babel-runtime
│   ├── better-scroll
│   ├── chameleon-api
│   ├── chameleon-bridge
│   ├── chameleon-runtime
│   ├── chameleon-store
│   ├── chameleon-ui-builtin
│   ├── classnames
│   ├── cml-ui
│   ├── core-js
│   ├── fetch-detector
│   ├── fetch-ie8
│   ├── mobx
│   ├── regenerator-runtime
│   └── vuex
├── npm-shrinkwrap.json
├── package.json
├── src					//chameleon项目主要资源文件
│   ├── app					//入口
│      ├── app.cml		
│   ├── assets				//资源
│   ├── components			//组件
│   ├── pages               //页面
│   ├── router.config.json  //路由配置
│   └── store				//数据store
```

### 2 [vue-cli](https://github.com/vuejs/vue-cli/tree/v2#vue-cli--)生成的项目迁移到chameleon

这里以`vue-cli`初始化的项目作为案例；

```
vue init webpack vue-project
```

`vue-project`目录下

```javascript
.
├── README.md
├── build
│   ├── build.js
│   ├── check-versions.js
│   ├── logo.png
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── index.html
├── package-lock.json
├── package.json
├── src             //这里可以理解为 对应的是 chameleon-project目录下的src
│   ├── App.vue     //入口主组件 
│   ├── assets      //项目资源文件
│   ├── components  //项目组件
│   ├── main.js     //主入口
│   └── router		//路由配置
└── static
```

#### 2.1 assets文件迁移

将组件的依赖资源迁移到 `chameleon-project/src/assets/`下

#### 2.2 components文件迁移

`chameleon-tool`初始化的项目相比`vue-cli`初始化的项目，在`src`文件夹下有 `pages`这个文件夹，主要作用是承载

`router.config.json`中配置的单个页面；

`components`文件迁移的时候，注意点

* 要按照`chameleon`的语法进行一些修整，将文件名后缀改为`.cml`,在符合`chameleon`语法的规范的情况下，可以做到适配多端；
* 将 `<script cml-type="json"></script>`中的配置填入要迁移的组件中；
* 如果是页面级别的组件，放到 `chameleon-project/src/pages`文件夹下，如果是组件级别的就放到 `chameleon-project/src/components`文件夹下;

#### 2.3 router文件迁移

`vue-project` 路由配置

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        }
    ]
})

```

`chameleon-project`路由配置

**假如将 `HelloWorld.vue`组件迁移到`chameleon-project/src/pages`下面**

```javascript
{
  "mode": "history",
  "domain": "https://www.chameleon.com",
  "routes":[
    {
      "url": "/cml/h5/index",
      "path": "/pages/index/index",
      "name": "首页",
      "mock": "index.php"
    },
    {
      "url": "/helloworld",
      "path": "/pages/helloworld/helloworld",
      "name": "首页",
      "mock": "index.php"
    }
  ]
}
```

## 二、模板迁移细则
### 1、模板语法迁移，具体细则参考 [chameleon语法教程](../view/view.html)

迁移前：



```vue
<template>
  <div class="hello">
    <h1>sss{{msg}}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

```

迁移后：



```vue
<template>
  <div class="hello">
    <h1>sss{{msg}}</h1>
  </div>
</template>

<script>
class HelloWorld {
  data = {
     msg: 'Welcome to Your Vue.js App'
  }
}
export default new HelloWorld();
</script>
<script cml-type="json">
{
  "base": {
    "usingComponents": {
    }
  },
  "wx": {
    "navigationBarTitleText": "index",
    "backgroundTextStyle": "dark",
    "backgroundColor": "#E2E2E2"
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

```



主要经过以下三步迁移

#### 1.1 `template中的模板语法迁移`，参考[这里](../view/cml.html)

#### 1.2 `script`中的逻辑层语法迁移，参考[这里](../logic/logic.html)

#### 1.3 `style` 中的样式语法迁移，参考[这里](../view/cmss.html)

#### 1.4 增加  `<script cml-type="json"></script>`

### 2、逻辑 具体参考 [chameleon API教程](../api/api.html)

#### 2.1 网络请求的迁移

一般web端我们可以会用一些`fetch  axios  `等 `http`请求库，微信端我们会用微信提供的[ `wx.request()`](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)这样的`http`网络请求接口，但是在`chameleon`项目中，对这些网络请求进行了统一的封装，需要将这些网络请求的逻辑改为 `cml.get({})  cml.post({})`,具体使用方式参考[这里](../api/request.html)

#### 2.2 路由导航的迁移

一般web端，我们都是通过 `vue-router` 的`router.push({ path: 'home' })` 这样的方式进行导航，微信端我们会通过`wx.navigateTo`进行导航，但是在`chameleon`项目中，对这些路由导航进行了统一的封装，需要将这些路由导航的逻辑改为 `cml.navigateTo   cml.redirectTo`,具体使用方式参考[这里](../api/navigate.html#navigateto)

### 2.3 数据存储的迁移

一般web端，我们通过 `localStorage`来存储一些数据，微信端通过 `wx.setStorageSync`这样的方式进行存储数据，但是在 `chameleon`项目中，对这些数据存储进行了统一的封装，需要将这些数据存储的逻辑改为`cml.setStorage  cml.getStorage`,具体的使用方式参考[这里](../api/storage.html#setstorage)

另外还有`Store`, 异步控制流等，具体的各个端的实现可以参考 `chameleon-api`的源码中 `.interface`文件，可以了解具体的实现；

具体需要迁移的逻辑点 可以主要参考 [chameleon API教程](../api/api.html)

### 2.4 数据mock的迁移

如果您的原来的项目中有一些数据mock的功能，`chameleon`同样提供了更好的能力支持，具体使用方式可以参考[这里](../framework/mock.html)

## 3 组件迁移

#### 3.1 [标签名的迁移](../component/base/content/content.html)

如果想要做到一套代码适配多端，标签名的修改是必不可少的，`chameleon`内部对标签名做了统一的转化，可以做到适配多端的效果，具体的转化规则如下



| chameleon  | Web  | Weex  | Wx         |
| ---------- | ---- | ----- | ---------- |
| view       | div  | div   | view       |
| cover-view | div  | div   | cover-view |
| text       | span | span  | text       |
| image      | img  | image | image      |
| button     | div  | div   | button     |
| cell       | cell | cell  | view       |



#### 3.2 基础组件的迁移

chameleon项目内置了一些组件，包括[布局容器](../component/base/layout/layout.html)，[表单组件](../component/base/form/form.html)，[媒体组件](../component/base/media/media.html)

对于项目中用到对应的内容，需要进行迁移才能保证多端的适配

#### 3.3 扩展组件的迁移

chameleon项目同样提供了一些功能性更强的组件 [扩展组件](../component/expand/expand.html),这些组件同样都很好的适配了多端，如果项目中有类似于这样的组件功能，需要进行替换；当然您也可以基于基础标签和基础组件进行自己的组件扩展；



## 三 项目迁移注意点

### 1 chameleon目前不支持路由嵌套，即只能如下配置一层子路由，不支持子路由在嵌套路由

```javascript
{
  "mode": "history",
  "domain": "https://www.chameleon.com",
  "routes":[
    {
      "url": "/cml/h5/index",
      "path": "/pages/index/index",
      "name": "首页",
      "mock": "index.php"
    },
    {
      "url": "/cml/h5/index",
      "path": "/pages/index/index",
      "name": "首页",
      "mock": "index.php"
    },
    //...
  ]
}
```

### 2 chameleon项目中的模板中 ，样式语法中 不支持class嵌套写法

### 3 在迁移到`chameleon`项目中的时候，如果想要适配多端（web wx），组件的标签名必须符合[组件教程](../component/component.html),里面的标签名才能真正的在多端得到良好的适配；



### web 项目

### weex 项目

### 小程序项目