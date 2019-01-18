# 配置多态
配置多态体现在两个方面：
## 1 项目配置
项目根目录下的chameleon.config.js是项目的配置文件，其中可以针对各端各构建命令实现灵活的配置，
```javascript
cml.config.merge({
  wx: {
    dev: {
    },
    build: {
    }
  },
  web: {
    dev: {
    },
    build: {
    }
  },
  weex: {
    dev: {
    },
    build: {
    },
    custom: {
    }
  }
})
```

##  2 组件配置
组件的配置位于cml文件内,可以对各端做差异化的配置。
```html
<script cml-type="json">
{
  "base":{
    "usingComponents": {
      "navi": "/components/navi/navi",
      "c-cell": "/components/c-cell/c-cell",
      "c-list": "/components/c-list/c-list",
      "navi-npm": "cml-test-ui/navi/navi"
    }
  },
  "wx": {
    "navigationBarTitleText": "index",
     "backgroundTextStyle": "dark",
     "backgroundColor": "#E2E2E2",
     "component": true
  }
  "web": {
  },
  "weex": {
  }
}
</script>
```