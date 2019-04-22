# CML模板语言协议


### CML支持两种语法，在模板`template`标签中声明 `lang`属性即可

声明模板中用  `cml` 语法

```vue
<template lang="cml"> </template>
```

声明模板中用类 `vue` 的语法

```vue
<template lang="vue"> </template>
```

如果不声明的话默认就是cml语法

### CML语法协议

#### 数据绑定

模板中的数据要使用 Mustache`{{}}`将变量包起来，可以作用于

##### 标签内容


```vue
<view >{{message}}</view>

```

```javascript
class Index{
  data = {
    message:"hello chameleon"
  }
}
```

##### 组件属性

简单属性

```vue
<view id="item-{{id}}"></view>

```

```javascript
class Index{
  data = {
    id:0
  }
}
```

控制属性

```vue
<view c-if="{{condition}}"></view>
```


##### 运算：可以在 `{{}}`中进行简单的运算，支持如下几种形式

三元运算

```vue
<view class="{{true ? 'cls1':'cls2'}}"></view>
```

逻辑判断

```vue
<view c-if="{{length > 5}}"> </view>
```

字符串运算

```vue
<view >{{'hello' + name}} </view>

```
```javascript
class Index{
  data = {
    name:'chameleon'
  }
}
```

数据路径运算

```vue
<view >{{object.key}} {{array[0]}}</view>
```

```javascript
class Index{
  data = {
    object:{key:'Hello'},
    array:['Chameleon']
  }
}
```
##### 组合 

可以在 `{{}}`中直接写数组；

```vue
<view 
  c-for="{{[{name:'apple'},{name:'orange'}]}}">
  {{item.name}}
</view>
```
#### 列表渲染

默认数组的当前项的下标变量名为 `index`,数组当前项的变量名为`item`

```vue
<view c-for="{{array}}">
{{index}}:{{item.message}}
</view>

```

```javascript
class Index{
  data = {
    array:[{
      message:"foo",
    },{
      message:"bar",
    }]
  }
}
```
使用 `c-for-item`可以用来指定数组当前元素的变量名

使用`c-for-index`可以指定数组当前下标的变量名

```vue
<view c-for="{{array}}" c-for-item="itemName" c-for-index="idx">
{{idx}}:{{itemName.message}}
</view>

```
如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态

`c-key` 的值以两种形式提供

字符串，代表在 for 循环的 array 中 item 的某个 property，该 property 的值需要是列表中唯一的字符串或数字，且不能动态改变。
保留关键字 *this 代表在 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字，如：
当数据改变触发渲染层重新渲染的时候，会校正带有 key 的组件，框架会确保他们被重新排序，而不是重新创建，以确保使组件保持自身的状态，并且提高列表渲染时的效率。

`c-key`等于item项中某个property

```vue
<view c-for="{{array}}" c-key="id">
</view>

```

```javascript
class Index{
  data = {
    array:[{
      id:"foo",
    },{
      id:"bar",
    }]
  }
}
```

`c-key`等于关键字 `*this`

```vue
<view c-for="{{array}}" c-key="*this">
</view>

```

```javascript
class Index{
  data = {
    array:[1,2,3]
  }
}
```

#### 条件渲染

```vue
<view c-if="{{condition}}"></view>
```

结合`c-else-if c-else`

```vue
<view c-if="{{condition}}"></view>
<view c-else-if="{{condition}}"></view>
<view c-else></view>
```

#### 事件绑定

`c-bind`表示可以冒泡的事件

```vue
<view c-bind:click="handleClick"></view>
```
```javascript
class Index{
  methods = {
    handleClick(e){
      console.log(e)  //默认传递一个事件对象参数
    }
  }
}
```
`c-catch`表示阻止冒泡的事件

```vue
<view c-catch:click="handleClick"></view>
```

内联事件

内联事件可以直接传递参数，特殊的参数 `$event`代表事件对象参数
```vue
<view c-for="{{array}}" >
  <view c-bind:click="handleClick1(1,'string',item,index)"></view>
  <view c-bind:click="handleClick2(1,'string',item,index,$event)"></view>
</view>
```

```javascript
class Index{
  data = {
    array:[{name:'apple'},{name:'orange'}]
  }
  methods = {
    handleClick1(...args){
      console.log(...args)
    }
    handleClick1(...args){
      console.log(...args)
    }
  }
}
```


### 类Vue语法协议


#### 数据绑定


##### 标签内容

模板中的标签内容中的变量要使用 Mustache`{{}}`包起来

```vue
<view >{{message}}</view>

```

```javascript
class Index{
  data = {
    message:"hello chameleon"
  }
}
```

标签中的内容支持简单的运算


字符串运算

```vue
<view >{{'hello' + name}} </view>
```

```javascript
class Index{
  data = {
    name:'chameleon'
  }
}
```

数据路径运算

```vue
<view >{{object.key}} {{array[0]}}</view>
```

```javascript
class Index{
  data = {
    object:{key:'Hello'},
    array:['Chameleon']
  }
}
```
##### 组件属性


简单属性

模板中组件属性中的变量要通过 `:id="value" `或者 `v-bind:id="value"`这种形式去使用。

```vue
<view :id="'item-'+id"></view>

```

```javascript
class Index{
  data = {
    id:0
  }
}
```

控制属性


```vue
<view v-if="condition"></view>
```

#### 列表渲染
`v-for`指令根据一组数组的选项列表进行渲染。`v-for` 指令需要使用  `（item,index) in items` 形式的特殊语法，`items` 是源数据数组并且 `item `是数组元素迭代的别名,`index`是数组元素的下标

```vue
<view v-for="(item,index) in array">
{{index}}:{{item.message}}
</view>

```

```javascript
class Index{
  data = {
    array:[{
      message:"foo",
    },{
      message:"bar",
    }]
  }
}
```

如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态

`:key` 的值以两种形式提供



```vue
<view v-for="(item,index) in array" :key="item.id">
</view>

```

```javascript
class Index{
  data = {
    array:[{
      id:"foo",
    },{
      id:"bar",
    }]
  }
}
```

`:key`等于 数组元素

```vue
<view v-for="(item,index) in array" :key="item">
</view>

```

```javascript
class Index{
  data = {
    array:[1,2,3]
  }
}
```

#### 条件渲染

```vue
<view v-if="condition"></view>
```

结合`v-else-if v-else`

```vue
<view v-if="length < 5"></view>
<view v-else-if="length > 5"></view>
<view v-else></view>
```

```javascript
class Index{
  data = {
    length:5
  }
}
```
#### 事件绑定

`@eventName `或者 `v-on:eventName` 表示可以冒泡的事件

```vue
<view @click="handleClick"></view>
```
```javascript
class Index{
  methods = {
    handleClick(e){
      console.log(e)  //默认传递一个事件对象参数
    }
  }
}
```
`@eventName.stop`或者`v-on:eventName.stop`表示阻止冒泡的事件

```vue
<view @click.stop="handleClick"></view>
```

内联事件

内联事件可以直接传递参数，特殊的参数 `$event`代表事件对象参数

```vue
<view v-for="(item,index) in array" >
  <view @click="handleClick1(1,'string',item,index)"></view>
  <view @click.stop="handleClick2(1,'string',item,index,$event)"></view>
</view>
```

```javascript
class Index{
  data = {
    array:[{name:'apple'},{name:'orange'}]
  }
  methods = {
    handleClick1(...args){
      console.log(...args)
    }
    handleClick1(...args){
      console.log(...args)
    }
  }
}
```