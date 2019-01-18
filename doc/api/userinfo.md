# 获得用户信息

## getUserInfo
获取滴滴出行用户基本信息

### 参数

无

### 返回值
Promise成功回调返回值：

|返回值|类型|说明|
|:--:|:--:|:--:|
|token|String|用户token|
|uid|String|用户id|
|phone|String|手机号|

### 举例

```javascript
  cml.getUserInfo().then((info)=>{
      // 处理返回值
  }, ()=>{

  })
```
