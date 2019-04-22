# 组件化标准
MVVM标准中将`.cml`文件分为三类，`src/app/app.cml`为app，`router.config.json`中配置的路由对应的文件为page，其他的`.cml`文件为component。
### 组件引用
在`.cml`文件的`<script cml-type="json"></script>`json部分，`usingComponents`字段中声明组件的引用。
例如：
```
{
  "base":{
    "usingComponents": {
      "navi": "/components/navi/navi",
      "c-cell": "../components/c-cell/c-cell",
      "navi-npm": "cml-test-ui/navi/navi"
    }
  }
}
```

`usingComponents`对象中，key为组件名称，组件名称为小写字母、中划线和下划线组成。value为组件路径，组件路径的规则如下：
- 相对当前文件的相对路径
- src下的绝对路径
- node_modules下的组件直接从npm的包名称开始写例如cml-test-ui/navi/navi
- 组件的路径禁止包含后缀扩展名，查找的优先级为
  - 1.interface文件指向的多态组件  
  - 2 .cml文件
  - 3 用户通过hook: find-component找到的组件


### 组件使用
组件在CML模板中使用，组件名为usingComponents中的key值，组件使用形式为闭合标签，标签名为组件名。例如：

```html
<template>
  <c-cell><c-cell>
</template>
<script cml-type="json">
{
  "base":{
    "usingComponents": {
      "c-cell": "../components/c-cell/c-cell"
    }
  }
}
</script>
```
