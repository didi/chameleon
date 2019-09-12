# chameleon尝鲜版

## 安装

```
npm i -g chameleon-tool@1.0.3
```

## 新功能说明

增加了对`支付宝小程序`和`百度小程序`的支持。

> 基于框架规范，无需修改，无缝即可增加产出`支付宝小程序`和`百度小程序`的目标程序，真正实现了一次编写多端运行，使用方式可参考[快速上手](./quick_start/quick_start.html)

## 注意

由于支付宝小程序使用`prop`属性为`data`时，获取值不正确，所以`c-picker`、`c-picker-item`组件时，传入组件的列表属性名由`data`改为`list`, 请在使用的时候记得修改~

## 旧项目升级支持支付宝与百度小程序
如果原有项目是使用chameleon-tool@0.0.x 版本生成，想要支持支付宝和百度小程序需要做如下操作：
- 1 升级chameleon-tool `npm i -g chameleon-tool@1.0.3`
- 2 升级原有项目的npm依赖， 将原有项目的package.json中的依赖升级到如下指定版本
```
  "dependencies": {
    "chameleon-api": "1.0.0",
    "chameleon-runtime": "1.0.0",
    "chameleon-store": "1.0.0",
    "chameleon-ui-builtin": "1.0.0",
    "cml-ui": "1.0.0"
  }
```
- 3 将 `chameleon.config.js`中的`platforms` 字段添加`alipay`与`baidu`,如下所示：
```
cml.config.merge({
  platforms: ["web","weex","wx","alipay","baidu"]
})
```
