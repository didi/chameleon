
## 扩展组件&能力

### 能力扩展
#### DCChameleonEventModule
公共能力、业务能力:
```html
-(void)initModule;
-(void)call:(NSString*)nameSpace jsonString:(NSString *)jsonString;
或-(void)call:(NSString*)nameSpace jsonString:(NSString *)jsonString callback:(WXModuleCallback)callback;

```
回滚web能力：
```html
-(void)rollbackWeb:(NSString *)urlStr;
```

#### DCChameleonImgLoaderDefaultImpl
图片下载能力:
```html
- (id<WXImageOperationProtocol>)downloadImageWithURL:(NSString *)url imageFrame:(CGRect)imageFrame userInfo:(NSDictionary *)userInfo completed:(void(^)(UIImage *image,  NSError *error, BOOL finished))completedBlock;
```

### 组件扩展
富文本组件`<richtext>`:
  ```html
数据格式：
{
"message": "富文本的文案",
"rich_message": [{"color": "##999999",
"font_size": "24",
"start": "0",
"end": "3"}]
}
```
