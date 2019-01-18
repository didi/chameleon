# 内置变量

## process.env.platform

chameleon项目提供了可以判断当前代码执行环境的变量`process.env.platform`,取值为`web, weex, wx, baidu, alipay`。 
chameleon项目中当出现有各端需要差异实现的代码时，我们建议采用多态接口的方式去解决，这样更利用项目的维护，当有特殊需求时，可以采用`process.env.platform` 变量进行判断。

```javascript
if(process.env.platform === 'wx') {
  console.log('this is wx platform')

} else if(process.env.platform === 'web') {
  console.log('this is web platform')
}
```

## process.env.apiPrefix

在 [数据mock](../../framework/mock.html)一节，讲解了如何mock一个api请求，其中就讲到了这个内置变量`process.env.apiPrefix`。它的值为用户配置的apiPrefix，dev模式默认为当前dev服务的ip+端口。提供这个内置变量的目的是让用户更方便的使用这个配置进行网络请求的模拟，更好的分离开发和线上环境。后续会支持多域名的配置。


```javascript
// 设置api请求前缀
const apiPrefix = 'http://api.chameleon.com';
cml.config.merge({
  wx: {
    dev: {
    },
    build: {
      apiPrefix
    }
  }
});
```
