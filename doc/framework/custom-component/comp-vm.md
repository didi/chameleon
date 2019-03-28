# 组件 VM

在`.cml` 文件 `<script />` 代码块`export default`的对象实例，可用于定义组件，指定组件的属性、数据、方法等。

```
cml init component
选择普通组件
输入 component-tag-name
```

定义如下：

| 字段名                                                | 类型     | 说明                                                         |
| ----------------------------------------------------- | -------- | ------------------------------------------------------------ |
| props                                                 | Object   | 声明当前组件可接收数据属性  props = { type, default }  type为数据类型，default为数据默认值 |
| data                                                  | Object   | CML模板可直接使用的响应数据，是连接视图层的枢纽              |
| methods                                               | Object   | 处理业务逻辑与交互逻辑的方法                                 |
| [watch](https://cmljs.org/doc/logic/watch.html)       | Object   | 侦听属性，监听数据的变化，触发相应操作                       |
| [computed](https://cmljs.org/doc/logic/computed.html) | Object   | CML模板可直接使用的计算属性数据,也是连接视图层的枢纽         |
| beforeCreate                                          | Function | 例初始化之后，数据和方法挂在到实例之前 一个页面只会返回一次  |
| created                                               | Function | 数据及方法挂载完成                                           |
| beforeMount                                           | Function | 开始挂载已经编译完成的cml到对应的节点时                      |
| mounted                                               | Function | cml模板编译完成,且渲染到dom中完成                            |
| beforeDestroy                                         | Function | 实例销毁之前                                                 |
| destroyed                                             | Function | 实例销毁后                                                   |

## 组件间的通信

组件间的通信方式有以下几种：

### 父组件 -> 子组件： props传递

**代码示例**

```html
<!-- index.cml -->
<template>
<view >
  <component-tag-name parent-prop="{{parent}}">
  </component-tag-name>
</view>
  
</template>

<script>
class Index   {
  data = {
    parent:{msg:'this is parent message'}
  }
}

export default new Index();
</script>

```

```html
<!-- component-tag-name.cml -->
<template>
  <view>
    <view>{{parentProp.msg}}</view>
  </view>
</template>

<script>

class ComponentTagName {
  props = {
    parentProp:{
      type:Object,
      default:{}
    }
  }
}

export default new ComponentTagName();
</script>
```

### 子组件 -> 父组件：事件通讯 [参考](https://cmljs.org/doc/view/event.html)

**代码示例**

```html
<!-- index.cml -->
<template>
<view >
  <component-tag-name  c-bind:parentevent="handleParentEvent">
  </component-tag-name>
</view>
</template>
<script>

class Index   {
  methods = {
    handleParentEvent(...args){
      console.log(...args)
    }
  }
}
export default new Index();
</script>
```

```html
<!-- component-tag-name.cml -->
<template>
  <view>
    <view c-bind:tap="handleClick"></view>
  </view>
</template>
<script>
class ComponentTagName {
  methods = {
    handleClick(){
      this.$emit('parentevent',{
        value:'this is from child'
      })
    }
  }
}
export default new ComponentTagName();
</script>

```

