# 事件系统标准
`Chameleon` 支持一些基础的原生事件和自定义事件，保障各端效果一致运行。

- 事件是视图层到逻辑层的通讯方式。
- 事件可以将用户的行为反馈到逻辑层进行处理。
- 事件可以绑定在组件上，当达到触发事件，就会执行逻辑层中对应的事件处理函数。

## 原生事件标准
当用户点击该组件的时候会在该组件逻辑[vm对象](./vm.md)的`methods`中寻找相应的处理函数，该处理函数会收到一个事件对象。
### 原生基础事件的类型

<table>
  <tr>
    <th>类型</th>
    <th>触发条件</th>
  </tr>
  <tr>
    <td>tap</td>
    <td>手指触摸后马上离开</td>
  </tr>
  <tr>
    <td>touchstart</td>
    <td>手指触摸动作开始</td>
  </tr>
  <tr>
    <td>touchmove</td>
    <td>手指触摸后移动</td>
  </tr>
  <tr>
    <td>touchend</td>
    <td>手指触摸动作结束</td>
  </tr>
</table>

### 原生事件对象
它有以下属性：

<table>
  <tr>
    <th>名称</th>
    <th>类型</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>type</td>
    <td>String</td>
    <td>事件类型</td>
  </tr>
  <tr>
    <td>timeStamp</td>
    <td>Number</td>
    <td>页面打开到触发事件所经过的毫秒数</td>
  </tr>
  <tr>
    <td>target</td>
    <td>Object</td>
    <td>
      触发事件的目标元素
      且 target = { id, dataset }
    </td>
  </tr>
  <tr>
    <td>currentTarget</td>
    <td>Object</td>
    <td>
      绑定事件的目标元素
      且 currentTarget = { id, dataset }
    </td>
  </tr>
  <tr>
    <td>touches</td>
    <td>Array</td>
    <td>
      触摸事件中的属性，当前停留在屏幕中的触摸点信息的数组
      且 touches = [{
        identifier,
        pageX,
        pageY,
        clientX,
        clientY
      }]
    </td>
  </tr>
  <tr>
    <td>changedTouches</td>
    <td>Array</td>
    <td>
      触摸事件中的属性，当前变化的触摸点信息的数组
      且 changedTouches = [{
        identifier,
        pageX,
        pageY,
        clientX,
        clientY
      }]
    </td>
  </tr>
  <tr>
    <td>detail</td>
    <td>Object</td>
    <td>
      自定义事件所携带的数据。
      通过`$cmlEmit`方法触发自定义事件，可以传递自定义数据即detail。具体下面`自定义事件`。
    </td>
  </tr>
  <tr>
    <td>_originEvent</td>
    <td>Object</td>
    <td>
      chameleon对各平台的事件对象进行统一，会把原始的事件对象放到_originEvent属性中，当需要特殊处理的可以进行访问。
    </td>
  </tr>
</table>

#### target && currentTarget 事件属性
<table>
<tr><th>属性</th><th>类型</th><th>说明</th></tr>
<tr><td>id</td><td>String</td><td>事件源组件的id</td></tr>
<tr><td>dataset</td><td>Object</td><td>事件源组件上由`data-`开头的自定义属性组成的集合</td></tr>
<!-- <tr><td>offsetLeft</td><td>Number</td><td>事件源组件相对于窗口左侧的距离</td></tr>
<tr><td>offsetTop</td><td>Number</td><td>事事件源组件相对于窗口上侧的距离</td></tr> -->
</table>

#### touches && changedTouches 事件属性
数组中的对象具有如下属性：
<table>
<tr>
<th>属性</th><th>类型</th><th>说明</th>
</tr>
<tr>
<td>identifier</td><td>Number</td><td>触摸点的标识符</td>
</tr>
<tr>
<td>pageX, pageY</td><td>Number</td><td>距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴</td>
</tr>
<tr>
<td>clientX, clientY</td><td>Number</td><td>距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴</td>
</tr>
</table>

## 自定义事件标准
自定义事件用于父子组件之间的通信，父组件给子组件绑定自定义事件，子组件内部触发该事件。绑定事件的方法是以`bind+事件名称="事件处理函数`的形式给组件添加属性，<b>规定事件名称不能存在大写字母</b>触发事件的方法是调用`this.$cmlEmit(事件名称,detail对象)`。