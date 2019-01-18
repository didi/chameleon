
# 发送日志

## initLog

初始化发送日志功能

### 参数

|参数名|类型|必填|默认值|说明|
|:--:|:--:|:--:|:--:|:--:|
|config|Object|否|无|初始化时传入的配置项。如果需要支持微信小程序端，则config对象必传并且必须包含wxAppId字段与wxOpenId字段；如果仅支持web端与weex端，则可以不传入config对象|

### 返回值

无

### 举例

```javascript
    cml.initLog({
       wxAppId: 'wx614013665322121d2',
       wxOpenId: '123456'
    })
```
## sendLog

发送日志

### 参数

|参数名|类型|必填|默认值|说明|
|:--:|:--:|:--:|:--:|:--:|
|key|String|是|无|唯一值|
|params|Object|否|无|key-value形式，发送日志时携带的参数|

### 返回值

无

### 举例

```javascript
    cml.sendLog('index_pv', {
        uid: '123456'
    })
```
