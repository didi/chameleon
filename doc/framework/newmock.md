# api多域名mock
在<a href="./mock.html">数据mock</a>一节讲述了如何进行api数据的mock，但是只局限于所有api请求都是相同域名的情况，工作中可能出现一个项目请求多个域名的api接口，本节将讲解如和进行多域名的mock。

### 1 版本要求
- `chameleon-tool >= 0.2.0-alpha.0`
- `chameleon-api >= 0.3.0-alpha.4`

### 2 chameleon.config.js中配置多域名信息
domain对象配置多域名的信息。
`domain`, Object 类型。
配置在base对象中，可以作为所有平台的公共配置，dev模式中配置的`localhost`会替换成当前dev模式启动的web服务ip+端口。 具体使用文档参见<a href="./newmock.html">api多域名mock</a>

例如：
```
cml.config.merge({
  base: {
    dev: {
      domain: {
        domain1: "localhost",
        domain2: "localhost"
      },
    },
    build: {
      domain: {
        domain1: "http://api.cml.com",
        domain2: "http://api2.cml.com"
      },
    }
  },
})
```

### 3 使用 chameleon-api 发网络请求
`chameleon-api`的网络请求`get、post、request`方法中添加domain参数。
`chameleon.config.js`中添加的`domain`对象配置，在项目中可以通过`process.env.domain`变量访问。

例如：
```javascript
import cml from "chameleon-api";
cml.get({
  domain: process.env.domain.domain1
  url: '/api/getMessage'
})
.then(res => {
  cml.showToast({
    message: JSON.stringify(res),
    duration: 2000
  })
}, 
err => {
  cml.showToast({
    message: JSON.stringify(err),
    duration: 2000
  })
});
```

### 4 配置mock数据

 前两步操作实现了网络请求dev模式请求本地，build模式请求线上，这一步就讲解如何mock本地多域名的请求数据。
 
 在`/mock/api/`文件夹下创建mock数据的js文件。文件内容格式如下：
```javascript

module.exports = [{
  domainKey: 'domain1',
  request: [
    {
      method: ['get', 'post'],
      path: '/api/getMessage',
      controller: function (req, res, next) {
        res.json({
          total: 0,
          message: [{
            name: 'Hello chameleon! domain1'
          }]
        });
      }
    }
  ] 
},
{
  domainKey: 'domain2',
  request: [
    {
      method: ['get', 'post'],
      path: '/api/getMessage',
      controller: function (req, res, next) {
        res.json({
          total: 0,
          message: [{
            name: 'domain2!'
          }]
        });
      }
    }
  ] 
}]
```
- domainKey 指定mock的域名，对应chameleon.config.js中domain对象的key值。
- method指定请求方法，默认值['get','post']
- path指定请求的路径
- controller 是express的中间件形式，在中间件中可以做任何操作最后调用res的方法返回结果。
