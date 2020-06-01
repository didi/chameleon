
// 设置静态资源的线上路径
const publicPath = '//www.static.chameleon.com/cml';
// 设置api请求前缀
const apiPrefix = 'https://api.chameleon.com';

cml.config.merge({
  templateLang: 'cml',
  templateType: 'html',
  platforms: ['web', 'weex', 'wx'],
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
      console: false,
      isWrapComponent: false // 取消默认对组件的包裹
    },
    build: {
      analysis: false,
      publicPath: `${publicPath}/web/`,
      apiPrefix,
      isWrapComponent: false // 取消默认对组件的包裹
    }
  },
  weex: {
    dev: {
      isWrapComponent: false // 取消默认对组件的包裹
    },
    build: {
      publicPath: `${publicPath}/weex/`,
      apiPrefix,
      isWrapComponent: false // 取消默认对组件的包裹
    },
    custom: {
      publicPath: `${publicPath}/wx/`,
      apiPrefix
    }
  },
  optimize: {
    watchNodeModules: true,// 设置为true对于调试 node_modules 里面的内容很有帮助
    showWarning:true,//设置为true可以在构建过程中看到警告信息，比如编译过程中引入了同一个npm包的不同版本会在终端输出信息
  },
})

