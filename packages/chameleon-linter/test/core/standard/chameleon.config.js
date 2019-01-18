
// 设置静态资源的线上路径
const publicPath = 'https://static.chameleon.com/pinche/hkcml';
// 设置api请求前缀
const apiPrefix = 'https://api.chameleon.com';

cml.config.merge({
  cmlComponents: [
    'chameleon-ui',
  ],
  buildInfo: {
    wxAppId: '123456',
    wxEntryPage: '',
    webPath: 'https://api.chameleon.com/h5/commentinfo'
  },
  check: {
    enable: true,
    enableTypes: ['Object', 'Array', 'Nullable']
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
