
// 设置静态资源的线上路径
const publicPath = '//www.static.chameleon.com/cml';
// 设置api请求前缀
const apiPrefix = 'https://api.chameleon.com';
const path = require('path');

cml.config.merge({
  templateLang: "cml",
  templateType: "html",
  builtinNpmName: 'cml-demo-ui-builtin',
  extPlatform: {
    demo: 'cml-demo-plugin',
  },
  babelPath: [
    path.join(__dirname,'node_modules/cml-demo-ui-builtin'),
    path.join(__dirname,'node_modules/cml-demo-runtime'),
    path.join(__dirname,'node_modules/cml-demo-api'),
  ],
  platforms: ["web","weex","wx","alipay","baidu"],
  buildInfo: {
    wxAppId: '123456'
  },
  wx: {
    dev: {
    },
    build: {
      apiPrefix
    }
  },
  web: {
    dev: {
      analysis: false,
      console: false
    },
    build: {
      analysis: false,
      publicPath: `${publicPath}/web/`,
      apiPrefix
    }
  },
  weex: {
    dev: {
    },
    build: {
      publicPath: `${publicPath}/weex/`,
      apiPrefix
    },
    custom: {
      publicPath: `${publicPath}/wx/`,
      apiPrefix
    }
  }
})

