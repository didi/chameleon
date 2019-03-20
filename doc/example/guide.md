# cml指南(Guide)

`cml` 作为真正让一套代码运行多端的框架，提供标准的MVVM模式，统一开发各类终端。

同时，拥有各端独立的 `运行时框架(runtime)`、`数据管理(store)`、`组件库(ui)`、`接口(api)`。

此外，`cml`在跨端`能力加强`、`能力统一`、`表现一致`等方面做了许多工作，包括不限于以下内容：

<table>
  <tr>
    <th>节点</th>
    <th>项目工程</th>
    <th>项目结构</th>
    <th>路由</th>
    <th>组件</th>
    <th>布局和外观</th>
    <th>数据视图驱动</th>
    <th>生命周期</th>
    <th>交互事件</th>
    <th>数据管理</th>
    <th>本地接口</th>
    <th>尺寸单位</th>
  </tr>
  <tr>
    <td>关键词</td>
    <td>chameleon.config.js</td>
    <td>app、 components、pages、store</td>
    <td>Chameleon URL</td>
    <td>CML单文件</td>
    <td>CMSS</td>
    <td>CML语法、类VUE</td>
    <td>beforeCreate-created-beforeMount-mounted-beforeDestroy-destroyed</td>
    <td>c-bindevent</td>
    <td>类vuex</td>
    <td>chameleon-api</td>
    <td>cpx</td>
  </tr>
  <tr>
    <td>统一性</td>
    <td>针对工程化可以自由定制某端差异化</td>
    <td>统一结构</td>
    <td>自适应打开不同环境同一页面</td>
    <td>CML、CMSS、逻辑JS、JSON</td>
    <td>UI的布局、元素尺寸、文本颜色等</td>
    <td>定义CML，类vue语法</td>
    <td>提供6个基础生命周期</td>
    <td>统一绑定方式</td>
    <td>vuex易用性强</td>
    <td>vuex易用性强</td>
    <td>提供虚拟单位cpx</td>
  </tr>
  <tr>
    <td>差异性</td>
    <td>各类都可以配置</td>
    <td></td>
    <td>H5配置可差异化</td>
    <td colspan="8">多态协议</td>
  </tr>
</table>


- `各端独立`意味着：易扩展。
- `MVVM协议`意味着：标准统一。

那么，开发者可以依据`MVVM协议`自由[扩展新端](https://cmljs.org/doc/extend/extend.html)。

今天，为了让大家的项目优雅升级，快速接入，

现推出`各端(vue、weex、小程序)迁移cml指南` 以及 `cml 导出组件到各端指南`，方便使用和扩展。

- [如何迁移一个Vue项目到chameleon](./web_to_chameleon.html)
- [如何迁移一个Weex项目到chameleon](./weex_to_chameleon.html)
- [如何迁移一个微信小程序到chameleon](https://cmljs.org/doc/example/wx_to_chameleon.html)
- [普通项目使用chameleon跨端dialog组件](https://cmljs.org/doc/example/webpack_output.html)





