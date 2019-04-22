# 目录与文件结构标准

### 项目结构标准
```
└── src // 项目源代码目录  
    ├── app 
    │   └── app.cml // app入口  
    ├── router.config.json // 路由配置文件 
    └── store 
        ├── index.js // 数据管理入口 
```

---

#### chameleon示例：
```

├── chameleon.config.js
├── mock 
│   ├── api
│   │   └── index.js
│   └── template
│       └── index.php
├── node_modules 
├── npm-shrinkwrap.json 
├── package.json
└── src 
    ├── app 
    │   └── app.cml 
    ├── assets
    │   └── images
    ├── components
    │   ├── com1
    │   └── demo-com
    ├── pages
    │   └── index
    ├── router.config.json
    └── store
        ├── actions.js
        ├── getters.js
        ├── index.js
        ├── mutations.js
        └── state.js
```

### `.cml`文件标准
`.cml`文件由四个标签部分组成，缺一不可。

第一个`<template></template>` 标签的标准属性为`lang`，用于标识模板的语法，lang的可选值为`vue和cml`,若不声明则默认为`cml`。标签内的最外层为单组件。标签内语法具体参见CML标准。

第二个`<script></script>`标签没有标准属性，标签内语言采用js的es6标准书写。

第三个`<style></style>` 标签的标准属性为`lang`，用于标识CMSS预处理语法，lang的可选值为`less和stylus`,若不声明则默认为`less`。

第三个`<script cml-type="json"></script>` 标签的必选属性为`cml-type="json"`,其中内容为`json`对象。`json`对象中的一级属性`base`为各平台的通用数据，各平台可以配置一个一级属性对象覆盖和扩展通用数据，例如微信小程序的属性对象为`wx`。

```

<template lang="cml">
</template>
<script>
</script>
<style lang="less">
</style>
<script cml-type="json">
{
  "base": {
  },
  "wx": {   
  }
}
</script>
```

### `.interface`多态API文件标准
作为API多态的`.interface`文件，由若干个`<script></script>`标签组成，标签根据`cml-type`属性来区分是接口定义部分还是各平台实现部分，`cml-type="interface"`属性标识该部分为接口定义部分，`cml-type="平台标识"`属性标识该部分为某平台实现。
接口定义部分定义接口`interface`对象，平台实现部分采用es6语法`export default`导出`class`，并该`class`需要实现接口定义部分的`interface`对象。
例如：
```
<script cml-type="interface">
interface UtilsInterface {
  getMsg(msg: string): void;
}
</script>
<script cml-type="web">
class Method implements UtilsInterface {
  getMsg(msg) {
    return 'web:' + msg;
  }
}
export default new Method();
</script>
<script cml-type="weex">
class Method implements UtilsInterface {
  getMsg(msg) {
    return 'weex:' + msg;
  }
}
export default new Method();
</script>
<script cml-type="wx">
class Method implements UtilsInterface {
  getMsg(msg) {
    return 'wx:' + msg;
  }
}
export default new Method();
</script>
```

#### 多态API的扩展
多态API的`.interface`文件在基础功能上提供两种语法方便用户扩展。
##### 1 `<script>`src
`<script></script>`标签可以通过指定`src`的方式引用外部js文件为某一平台的实现或者接口定义。其中src指定的路径只能为相对路径。例如：
```
<script cml-type="interface">
interface FirstInterface {
  getMsg(msg: String): String;
}

</script>

<script cml-type="web" src="./web.js"></script>
```
`web.js`文件内容如下：
```
class Method implements FirstInterface {
  getMsg(msg) {
    return 'web:' + msg;
  }
}

export default new Method();
```

##### 2 `<include>`标签

当前文件用`<include>`标签引入其他`.interface`文件中的接口定义和实现。然后在当前文件中去实现引入的接口定义，可以覆写引入的某一端实现，也可以去扩展新端的实现。 语法是`<include src="${相对路径}.interface"></include>`，有如下规则：

- src属性指向的文件路径只能使用相对路径。
- src指向的`.interface`文件中必须有接口定义部分`<script cml-type="interface"></script>`。
- 当前文件中不能有接口定义部分。
- 文件中只能出现一个`<include></include>`标签

#### 多态API编译优先级
当某一端编译时会编译`.interface`文件中的当前端的代码，因为`.interface`文件中有了`<include>`语法 所有就会有查找优先级。
- 1 在当前`.interface`文件中查找目标端的实现
- 2 在`<include>`标签`src`属性指向的文件中查找目标端的实现

例如有如下两个interface文件：
```
├── first
│   └── first.interface
└── second
    └── second.interface

```

`first.interface` 包括接口定义，web和weex端的实现，内容如下：
```
<script cml-type="interface">
interface FirstInterface {
  getMsg(msg: String): String;
}
</script>
<script cml-type="web">
class Method implements FirstInterface {
  getMsg(msg) {
    return 'first web:' + msg;
  }
}
export default new Method();
</script>
<script cml-type="weex">
class Method implements FirstInterface {
  getMsg(msg) {
    return 'first weex:' + msg;
  }
}
export default new Method();
</script>
```

`second.interface` 包括对`first.interface`的`include` weex端和wx端的实现，内容如下：
```
<include src="../first/first.interface"></include>
<script cml-type="weex">
class Method implements FirstInterface {
  getMsg(msg) {
    return 'second weex:' + msg;
  }
}
export default new Method();
</script>
<script cml-type="wx">
class Method implements FirstInterface {
  getMsg(msg) {
    return 'second wx:' + msg;
  }
}
export default new Method();
</script>

```

当外部引用`second.interface`文件并调用getMsg方法时 各端编译获取方法如下：
- web端编译，因为`second.interface`中没有web端实现 所以查找到`first.interface`中web端getMsg方法
- weex端，因为`second.interface`中有weex端实现 所以使用`second.interface`中weex端getMsg方法
- wx端，因为`second.interface`中有wx端实现 所以使用`second.interface`中wx端getMsg方法

总结： `<include></include>`可以继承接口和实现，并可以覆写实现。


### 多态组件标准
多态组件由`组件名.interface`文件和`组件名.平台标识.cml`文件组成。例如多态组件ph-com的构成。
```
├── ph-com.alipay.cml
├── ph-com.baidu.cml
├── ph-com.interface
├── ph-com.web.cml
├── ph-com.weex.cml
└── ph-com.wx.cml
```
#### .interface文件
`.interface`文件用于定义组件的属性和事件的`interface`。
- 1、 如何区分组件属性和事件？
通过类型来区分，事件为函数类型，属性为非函数类型
- 2、 如何定义组件属性？
给interface添加同名的属性即可，指定类型
- 3、 如何定义组件事件？
以事件名称为key值给interface定义属性，该属性是一个函数类型，返回值为void，
定义函数的第一个参数为自定义事件传递的detail对象类型
例如：
```
<script cml-type="interface">

//定义事件detail对象的参数
type EventDetail = {
  value: String
}
interface PhComInterface {
  name: String,
  onshow(eventDetail: EventDetail): void;
}
</script>

```

#### 组件实现
`组件名.平台标识.cml`文件用于组件的实现，其中`<script></script>`部分声明的VM对象的class必须实现`.interface`文件中声明的`interface`。
例如：

```
<script>
class PhCom implements PhComInterface {
  props = {
    name: {
      type: String,
      default: '默认值'
    }
  }
  mounted() {
    this.$cmlEmit('onshow',{
      value: this.name
    })
  }
}
export default new PhCom();
</script>

```


#### 多态组件的扩展
多态组件的`.interface`文件在基础功能上提供两种语法方便用户扩展。
##### 1 `<script>`src
`<script></script>`标签可以通过指定`src`的方式引用接口定义或者某端多态组件的实现，其中src指定的路径只能为相对路径。例如：
```
<script cml-type="interface" src="./com.js"></script>
<script cml-type="web" src="./com.web.cml"></script>
```

在查找多态组件的过程中，如果`.interface`文件中没有`<script></script>`标签指定对应端的组件实现，则查找与`.interface`同名的各端cml文件。


##### 2 `<include>`标签

当前`.interface`文件可以用`<include>`标签引入其他多态组件的`.interface`文件中的接口定义和对应的各端实现。
语法是`<include src="${相对路径}.interface"></include>`，有如下规则：

- src属性指向的文件路径只能使用相对路径。
- src指向的`.interface`文件中必须有接口定义部分`<script cml-type="interface"></script>`。
- 当前文件中不能有接口定义部分。
- 文件中只能出现一个`<include></include>`标签

#### 多态组件编译优先级
当某一端编译引用多态组件时，会按照如下优先级查找组件，例如：
- 1 查找`.interface`文件中指定当前端的组件，例如`<script cml-type="当前端" src="../com/com.当前端.cml"></script>` 则会查找到`../com/com.当前端.cml`组件
- 2 查找与`.interface`文件同级目录同文件名的当前端cml文件，例如`./组件名.当前端.cml`
- 3 在`<include>`标签`src`属性指向的`.interface`文件中按照1、2步继续查找组件。