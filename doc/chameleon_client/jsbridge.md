## H5 JS Bridge使用
除了[API](/api/api.html)里提到的3端通用的方法，我们还为web端在端内时支持了以下方法。你可以在web端的实现中单独引入`JSBridge`模块，使用以下方法。你也可以自己扩展自己的jsbridge并引入使用。

### 公共Bridge
#### DCFusionPlatFormAdaptor

- 分享功能：
```html
shareWeixinTimeline（微信朋友圈）
shareWeixinAppmsg （微信好友）
shareQqAppmsg （QQ好友）
```
- 调起相机、相册功能：
```html
photograph
```
- 获取信息功能：
```html
getSystemInfo
getUserInfo
getLocationInfo
```

### 顺风车扩展Bridge
#### DCFusionAdaptor

- 拨打电话功能:
```html
registerPhone（普通电话）
callPhone（调起VOIP打电话）
changePhone（调起VOIP打电话，修改主叫号码）
```
- IM功能：
```html
registerIM
```
- 登录功能：
```html
login
```
- 端内页面打开功能：
```html
openNativeWebPage(支持scheme、https)
openNativeBtsPage（支持scheme）
```
- 扫描二维码功能：
```html
scanQRCode
```
- 下载图片并保存到系统相册功能：
```html
savePhotoToAlbum
```
- 调用人脸识别功能：
```html
faceDetect
```
- 支付能力功能：
```html
payVerify（真身验证 支付认证）
addPrice （添加感谢费）
openFreePayment （打开免密功能 微信、支付宝）
payUniversalCallback （通用支付组件）
```
- 打开导航功能：
```html
launchNav
```
- 拉取更新个人信息功能：
```html
updateUserInfo
```
- 弹框提醒功能： 
```html
showAlert
```
