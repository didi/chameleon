# VM对象协议

逻辑层负责反馈用户对界面操作的处理中心。

而 `VM 对象` 是逻辑层规范的输入口，是运行时方法(`ceateApp`、`createComponent`、`createPage`)的输入，包括

<table>
<tr>
  <th>字段名</th><th>类型</th><th>说明</th>
</tr>
<tr>
  <td>props</td><td>Object</td>
  <td>
  声明当前组件可接收数据属性 <br/>
  props = { type, default } <br/>
  type为数据类型，default为数据默认值
  </td>
</tr>
<tr>
  <td>data</td><td>Object</td><td>CML模板可直接使用的响应数据，是连接视图层的枢纽</td>
</tr>
<tr>
  <td>methods</td><td>Object</td><td>处理业务逻辑与交互逻辑的方法</td>
</tr>
<tr>
  <td><a href="./watch.html">watch</a></td><td>Object</td><td>侦听属性，监听数据的变化，触发相应操作</td>
</tr>
<tr>
  <td><a href="./computed.html">computed</a></td><td>Object</td><td>CML模板可直接使用的计算属性数据,也是连接视图层的枢纽</td>
</tr>
<tr>
  <td>beforeCreate</td><td>Function</td><td>例初始化之后，数据和方法挂在到实例之前
    一个页面只会返回一次</td>
</tr>
<tr>
  <td>created</td><td>Function</td><td>数据及方法挂载完成</td>
</tr>
<tr>
  <td>beforeMount</td><td>Function</td><td>开始挂载已经编译完成的cml到对应的节点时</td>
</tr>
<tr>
  <td>mounted</td><td>Function</td><td>cml模板编译完成,且渲染到dom中完成</td>
</tr>
<tr>
  <td>beforeDestroy</td><td>Function</td><td>实例销毁之前</td>
</tr>
<tr>
  <td>destroyed</td><td>Function</td><td>实例销毁后</td>
</tr>
</table>

理解了每个输入字段代表的含义后，可以扩展(`ceateApp`、`createComponent`、`createPage`)处理`VM对象`，将`VM对象`转换成当前平台可接收的格式。

## 2 运行时能力注入
映射，并且在各生命周期中，注入新端到cml框架的运行时能力

### 2.1 生命周期hook映射
每个 `cml` 实例(`App`、`Page`、`Component`)在被创建时都要经过一系列的初始化过程 ———— 

例如，需要设置数据监听、编译模板、将实例挂载到 `CML节点` 并在数据变化时更新 `CML节点` 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给开发者在不同阶段添加自己的代码的机会。

`cml` 为`App`、`页面Page`、`组件Component` 提供了一系列生命周期事件，保障应用有序执行。 

另外，你还需要实现 [生命周期多态](https://cmljs.org/doc/logic/lifecycle.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%A4%9A%E6%80%81)。

### 2.2 methods
应用程序运行过程中，提供给上下文`this`可调用的方法

### 2.3 数据驱动能力
当做数据修改的时候，只需要在逻辑层修改数据，视图层就会做相应的更新。

注入的核心是：赋予生命周期hook `mixins扩展能力`，并且在特定hook中，赋予`this`响应数据变化的能力

### 2.3.1 data 数据属性
### 2.3.2 watch 监听属性
### 2.3.3 computed 计算属性

