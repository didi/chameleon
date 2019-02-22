# 快速上手

## 1 安装启动

> **[success] 运行环境 **
>
> [node](https://nodejs.org/en/download/) >= 8.10.0
> npm >= 5.6.0

建议安装使用[nvm](https://github.com/creationix/nvm)管理node版本

### 1.1 全局安装chameleon-tool构建工具

```shell
npm i -g chameleon-tool
```
安装成功后，执行 `cml -v` 即可查看当前版本， `cml -h`查看命令行帮助文档。

> **[success] 尝鲜版 **
>
> 尝鲜版提供了百度小程序和支付宝小程序的支持    
> 如果想提前使用可移步[这里查看使用](https://cmljs.org/doc/alpha_version.html)


### 1.2 创建项目与启动

- 执行 `cml init project`
- 输入项目名称
- 等待自动执行npm install依赖
- 切换到项目根目录执行`cml dev`
- 会自动打开预览界面 预览界面如下：

![](https://cmljs.org/doc/assets/home.png)

web端可以点击模拟器内页面右上角打开新的浏览器窗口。

native端的效果请下载[chameleon playground](https://beatles-chameleon.github.io/playground/download.html)(目前可下载Android端，IOS端即将发布)或者下载[weex playground](http://weex.apache.org/cn/tools/playground.html)扫码预览

小程序端请下载[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)，打开项目根目录下的 `/dist/wx` 目录预览。

<b>支付宝、百度小程序、快应用正在努力测试中，尽请期待。</b>

### 2 目录与文件结构

生成的目录结构如下，详细介绍参见<a href="https://cmljs.org/doc/framework/structure.html">目录结构</a>：

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
    ├── router.config.json              // 路由配置
    └── store                           // 全局状态管理
```
> 编辑器中语法高亮，暂时使用`.vue`的插件，参见<a href="https://cmljs.org/doc/framework/edit-plugin.html">编辑器插件</a>，后续会推出更强大的插件。



### 4 语法体验

替换`src/pages/index/index.cml`文件，删除`src/pages/index/index.cml`文件中的所有代码，然后替换为下面的代码，体验chameleon语法。

#### 数据绑定

```html
<template>
  <view>
    <!-- 数据绑定与计算属性 -->
    <text>{{ message }}</text>
    <text class="class1">{{ message2 }}</text>

    <!-- 条件与循环渲染 -->
    <view c-if="{{showlist}}">
      <view c-for="{{array}}" c-for-index="idx" c-for-item="itemName" c-key="city" >
        <text> {{idx}}: {{itemName.city}}</text>
      </view>
    </view>

    <!-- 事件绑定 -->
    <view c-bind:tap="changeShow"><text>切换展示</text></view>
  </view>
</template>

<script>
class Index {
  data = {
    message: 'Hello Chameleon!',
    array: [
      {
        city: '北京'
      },
      {
        city: '上海'
      },
      {
        city: '广州'
      }
    ],
    showlist: true
  }

  computed = {
    message2: function() {
      return 'computed' + this.message;
    }
  }

  watch = {
    showlist(newVal, oldVal) {
      console.log(`showlist changed:`+ newVal)
    }
  }

  methods = {
    changeShow() {
      this.showlist = !this.showlist;
    }
  }

  created() {
    console.log('生命周期')
  }
}

export default new Index();
</script>
<style scoped>
.class1 {
  color: #f00;
}
</style>
<script cml-type="json">
{}
</script>
```

### 5 创建新页面
项目根目录下执行`cml init page`, 输入页面名称first-page

```shell
$ cml init page
? Please input page name:
```
回车，即可生成页面组件`src/pages/first-page/first-page.cml`。

### 6 创建及引用组件

项目根目录下执行`cml init component`，选择`普通组件`,输入first-com，回车，即可生成文件`components/first-com/first-com.cml`。 组件也是cml文件结构上与页面相同。

拷贝如下代码到`first-com.cml`
```html
<template>
  <view>
    <text class="first-com-text">我是组件first-com</text>
  </view>
</template>
<script>
class FirstCom {

}
export default new FirstCom();
</script>
<style scoped>
.first-com-text {
  color: #0f0;
}
</style>
<script cml-type="json">
{}
</script>
```

然后在刚才的`src/pages/index/index.cml`中引用`first-com`

```html
<script cml-type="json">
{
  "base": {
    "usingComponents": {
      "first-com": "components/first-com/first-com"
    }
  }
}
</script>
```

template中使用first-com组件。

```html
<template>
  <view>
    <first-com></first-com>
  </view>
</template>
```

经过以上操作，你已经学会了组件的引用，[丰富的组件](https://cmljs.org/doc/component/component.html)等待着你去学习!


##进阶体验

### [7 项目配置](https://cmljs.org/doc/framework/config.html)

`chameleon.config.js`为项目的配置文件，以后定制化构建会使用到，比如是否带hash，是否压缩等等,可以在项目根目录下执行`cml build` ，执行完成后，项目根目录的`dist`文件夹下生成build模式的文件。

### [8 模拟数据](https://cmljs.org/doc/framework/mock.html)

`mock/api/index.js`文件内容如下，可以本地模拟api请求。访问`localhost:8000/api/getMessage`即可看到模拟的api返回。端口以实际启动为准，默认8000.

```javascript
module.exports = [
  {
    method: ['get', 'post'],
    path: '/api/getMessage',
    controller: function (req, res, next) {
      res.json({
        total: 0,
        message: [{
          name: 'Hello chameleon!'
        }]
      });
    }
  }
];
```
### 9 示例demo学习
`chameleon-tool`中内置了todolist的项目模板，通过命令`cml init project --demo todo` 即可生成该模板，按照1.2节中的说明启动项目，即可看到如下页面

![](https://cmljs.org/doc/assets/todo_preview.jpg)

经过以上的介绍和实践操作，相信你已经了解了chameleon的基本使用，本文档其余部分将涵盖剩余功能和其他高级功能的详尽细节，所以请务必完整阅读整个文档！

### [10 FAQ](https://cmljs.org/doc/framework/faq.html)

##### 我想使用chameleon，是否需要大刀阔斧的重构项目？
不需要，可以使用chameleon开发公用组件，<a href="https://cmljs.org/doc/terminal/io.html">导出</a>到各端原有项目中使用。

##### 用CML标准编写代码，是否增加调试成本？
我们实现了全面的语法检查功能，且在持续加强。理论上框架是降低调试成本，就像从原生js开发到vuejs、reactjs是否认为也增加了调试成本，见仁见智。

##### 各端包括小程序的接口更新频繁，如何保证框架编译的抽象度和稳定性？
1、自建输入语法标准 cml，编译输出结果自定的格式语法。
2、框架的runtime层实现匹配接收的编译输出代码，runtime跟随小程序更新。
3、框架整体方向一致：mvvm底层设计模式为标准设计接口。
基于以上三条，你可以理解为：我们设计了一个框架统一标准协议，再在各个端runtime分别实现这个框架，宏观的角度就像nodejs同时运行在window和macOS系统，就像flutter运行在Android和iOS一个道理。各端小程序接口更新除非遇到不向下兼容情况，否则不影响框架，如果真遇到不向下兼容更新，这种情况下是否用框架都需要改。

##### 框架有多大，性能是否有影响？
1、小程序的主要运行性能瓶颈是webview和js虚拟机的传输性能，我们在这里会做优化，尽可能diff出修改的部分进行传输，性能会更好。
2、包大小，小程序有包大小限制，web端包大小也是工程师关心的点。首先基于多态协议，产出包纯净保留单端代码；其次框架的api和组件会按需打包。包大小是我们重点发力点，会持续优化到极致。目前build模式包大小测试结果如下:
<span style="color: #ff534d;">minimize</span><span style="color: #edd0be;"> | </span><span style="color: #25c6fc;">minimize + gzip</span>   
<table style="color: #edd0be;">
<tr>
  <th>平台</th><th>js总体积</th><th>外部框架</th><th>chameleon运行时代码</th><th>其他代码</th>
</tr>
<tr>
  <td>web</td>
  <td>
    <span style="color: #ff534d;">141.87kb</span>  
    |
    <span style="color: #25c6fc;">43.72kb</span>
  </td>
  <td>
    vue+vuex+vue-router<br/>
    <span style="color: #ff534d;">99.26kb</span>  
    | 
    <span style="color: #25c6fc;">33.89kb</span>
  </td>
  <td>
    <span style="color: #ff534d;">35.96kb</span>  
    |
    <span style="color: #25c6fc;"> 8.85kb</span>
  </td>
  <td>
    业务代码
  </td>
</tr>
<tr>
  <td>weex</td><td>
    <span style="color: #ff534d;">135kb</span>  
    |
    <span style="color: #25c6fc;">32.43kb</span>
  </td>
  <td>
    vuex+vue-router<br/>
    <span style="color: #ff534d;">33.49kb</span>  
    | 
    <span style="color: #25c6fc;">17.96kb</span>
  </td>
  <td>
    <span style="color: #ff534d;">25.23kb</span>  
    |
    <span style="color: #25c6fc;">5.94kb</span>
  </td>
    <td>
    业务代码
  </td>
</tr>

<tr>
  <td>wx</td><td>
    <span style="color: #ff534d;">101.66kb</span>  
    |
    <span style="color: #25c6fc;">28.12kb</span>
  </td>
  <td>
    mobx算在chameleon运行时中  
  </td>
  <td>
    <span style="color: #ff534d;">98.75kb</span>  
    |
    <span style="color: #25c6fc;">26.53kb</span>
  </td>
    <td>
    业务代码
  </td>
</tr>

<tr>
  <td>baidu</td><td>
    <span style="color: #ff534d;">101.72kb</span>  
    |
    <span style="color: #25c6fc;"> 28.13kb</span>
  </td>
  <td>
    mobx算在chameleon运行时中  
  </td>
  <td>
    <span style="color: #ff534d;">98.78kb</span>  
    |
    <span style="color: #25c6fc;">26.61kb</span>
  </td>
    <td>
    业务代码
  </td>
</tr>

<tr>
  <td>alipay</td><td>
    <span style="color: #ff534d;">102kb</span>  
    |
    <span style="color: #25c6fc;">28.12kb</span>
  </td>
  <td>
    mobx算在chameleon运行时中  
  </td>
  <td>
    <span style="color: #ff534d;">99.15kb</span>  
    |
    <span style="color: #25c6fc;">26.34kb</span>
  </td>
    <td>
    业务代码
  </td>
</tr>


</table>

##### 我只想跨web和各类小程序，是否可以不使用 Flexbox 布局模型？
可以，如果你的项目不在 快应用、react-native、weex等平台运行，可以更便捷开发项目，特别是CSS的限制更少：
<a href="https://cmljs.org/doc/example/web_wx.html">只跨web和小程序的应用</a>
