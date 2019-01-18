## weex 端能力
除了[API](/api/api.html)里提到的3端通用的方法，我们还为weex端单独支持了以下方法。你可以在weex端的实现中单独引入`chameleon-bridge`模块，使用以下方法。

#### weexBridge.login(callback) 调起登录
##### 参数说明
返回值 {Object}
- action 状态 login_success/login_fail
- phone 手机号
- token 凭证
- uid 用户id


#### weexBridge.payVerify(cb) 验证支付能力

##### 参数说明

- cb {Function} : 回调

#### weexBridge.pay(params, cb) 验证支付能力

##### 参数说明

- params {Object} : 参数（后端下发）
- cb {Function} : 回调

#### weexBridge.shareWeixinAppmsg(OBJECT, callback) 分享到微信好友
##### 参数说明
OBJECT
- share_url 分享链接
- share_img_url 分享图片地址，如果为链接分享此项可以留空
- share_icon_url 分享图标
- share_title 分享标题文案
- share_content 分享正文文案

返回值 {Object}
- share_result 结果状态 1成功 2取消或失败
- channel 渠道wechat

#### weexBridge.shareWeixinTimeline(callback) 分享到微信朋友圈
##### 参数说明
OBJECT
- share_url 分享链接
- share_img_url 分享图片地址，如果为链接分享此项可以留空
- share_icon_url 分享图标
- share_title 分享标题文案
- share_content 分享正文文案

返回值 {Object}
- share_result 结果状态 1成功 2取消或失败
- channel 渠道wechat_timeline

#### weexBridge.getQueryObjSync() 获取来自weex容器下发的参数
##### 参数说明
返回值 {Object}

#### weexBridge.listenNative(event_name, callback) 监听客户端发来的事件
##### 参数说明
监听值
- onLoginChange 发生登录登出
- pageRefreshFromNative 需要刷新页面
- carServicePositionChange 车主服务位置变化

#### weexBridge.pageRefresh(OBJECT, callback) 刷新客户端的页面
##### 参数说明
OBJECT
- page_key 端上页面路径
```
车主常用路线列表   "/beatles/driver_onewaylist"
车主临时路线列表   "/beatles/driver_onewaylist"
乘客常用路线列表  "/beatles/route_order_list_passenger"
乘客临时路线列表(发单等待页)  "/beatles/passenger_waitlist"
司机查看订单详情  "/beatles_driver_orderdetail"
乘客查看订单详情  "/beatles_passenger_orderdetail"
首页乘客、车主刷新  "/beatles_homepage"
首页车主刷新  "/beatles_homepage_driver"
首页乘客刷新  "/beatles_homepage_passenger"
刷新车主服务首页 "/beatles_homepage_service"
```


#### weexBridge.openNativeBtsPage(OBJECT) 打开客户端页面
##### 参数说明
OBJECT 
- url 对应native URL Scheme地址

#### weexBridge.showOperationFloatLayer(OBJECT) 打开一个端上全屏的h5页面浮层
##### 参数说明
OBJECT 
```
{
    float_layer: {
        id: '1495076727706',
        type: '0',
        html5_url: 'http://didi.cn',
        times: '1000'
    }
}
```

#### weexBridge.registerIM(OBJECT) 打开IM
##### 参数说明
OBJECT 
- nickName 
- orderId
- sceneMsg
- sessionId
- userId
- routeId 订单详情页调起使用
- from 订单详情页调起使用


#### weexBridge.registerPhone(OBJECT) 拔打电话
##### 参数说明
OBJECT 
- phoneNumber 电话号码

示例
```
 weexBridge.registerPhone({
     phoneNumber: '11000001234'
 }) 
```

#### weexBridge.rollbackWeb() 主动降级到h5 
##### 参数说明
非特殊情况，不推荐使用


