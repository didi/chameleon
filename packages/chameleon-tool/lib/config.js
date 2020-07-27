
/*
moduleIdType 决定webpack打包模块的id
  number，默认的id
  hash 利用 webpack.HashedModuleIdsPlugin()
  name 利用webpack.NamedModulesPlugin()
  chameleon 利用chameleon-webpack-plugin 中开启moduleid的处理
*/
function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    const res = {}
    // eslint-disable-next-line guard-for-in
    for (const key in value) {
      res[key] = clone(value[key])
    }
    return res
  } else {
    return value
  }
}
var miniappConfig = {
  dev: {
    moduleIdType: 'name',
    definePlugin: {
      'process.env.NODE_ENV': JSON.stringify('development')
    }
    //  increase:true, 是否增量部署打包代码
  },
  build: {
    hash: true,
    minimize: true,
    definePlugin: {
      'process.env.NODE_ENV': JSON.stringify('production')
    }
  },
  export: {
    hash: true,
    minimize: true,
    definePlugin: {
      'process.env.NODE_ENV': JSON.stringify('production')
    },
    entry: [
      './src/components'
    ],
    publicPath: '../../'
  }
};

var chameleonConfig = {
  platforms: ['web', 'weex', 'wx', 'baidu', 'alipay'],
  // devPort: 8000,
  // projectName: undefined,
  templateType: 'html', // 模板类型 smarty or html，决定web页面的格式与dev web服务器的类型
  isBuildInProject: false, // 是否是内置组件项目,该项目不嵌入内置组件
  devOffPlatform: [], // dev 命令关闭的端
  buildOffPlatform: [], // build 命令关闭的端
  builtinNpmName: 'chameleon-ui-builtin', // 内置组件npm包的名称
  check: {
    enable: true, // 是否开启接口校验
    enableTypes: [] // 接口校验支持的类型 可以开启["Object","Array","Nullable"]
  },
  cmlComponents: [ // 配置node_modules中cml组件库
  ],
  baseStyle: { // 是否插入各端的基础样式
    wx: true,
    web: true,
    weex: true,
    alipay: true,
    baidu: true,
    qq: true,
    tt: true
  },
  proxy: {
    enable: false,
    mapremote: []
  },
  // entry: {
  //   template: 'entry_test/entry.html',
  //   web: 'entry_test/web.js',
  //   weex: 'entry_test/weex.js'
  // },
  buildInfo: { // 打包信息
    wxAppId: ''
  },
  enableLinter: true,
  enableGlobalCheck: true,
  globalCheckWhiteList: [ // 全局校验的白名单文件 后缀匹配
  ],
  cmss: {
    rem: true,
    scale: 0.5,
    remOptions: {
      // base on 750px standard.
      rootValue: {cpx: 75}, // cpx转rem px不处理
      // to leave 1px alone.
      minPixelValue: null
    },
    autoprefixOptions: {
      browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
    },
    // 是否对css开启autoprefix，默认为true  非weex端生效
    enableAutoPrefix: true
  },
  wx: clone(miniappConfig),
  alipay: clone(miniappConfig),
  baidu: clone(miniappConfig),
  qq: clone(miniappConfig),
  tt: clone(miniappConfig),
  web: {
    dev: {
      isWrapComponent: true, // 默认对组件进行一层包裹
      babelPolyfill: false, // 是否添加babel polyfill 只web端有此属性
      moduleIdType: 'name',
      hot: false,
      analysis: false,
      // apiPrefix: ,
      // staticPath: '', 静态资源路径前缀
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    },
    build: {
      isWrapComponent: true, // 默认对组件进行一层包裹
      babelPolyfill: false, // 是否添加babel polyfill 只web端有此属性
      hash: true,
      minimize: true,
      moduleIdType: 'chameleon',
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    },
    export: {
      isWrapComponent: true, // 默认对组件进行一层包裹
      hash: true,
      minimize: true,
      moduleIdType: 'chameleon',
      entry: [
        './components'
      ],
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    }
  },
  weex: {
    dev: {
      isWrapComponent: true, // 默认对组件进行一层包裹
      moduleIdType: 'name',
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    },
    build: {
      isWrapComponent: true, // 默认对组件进行一层包裹
      minimize: true,
      hash: true,
      moduleIdType: 'chameleon',
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    },
    export: {
      isWrapComponent: true, // 默认对组件进行一层包裹
      hash: true,
      minimize: true,
      moduleIdType: 'chameleon',
      entry: [
        './components'
      ],
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    }
  },
  optimize: {
    watchNodeModules: false, // 默认不对node_modules中的文件进行watch,提升编译性能
    showWarning: false, // 为了兼容原来的配置，默认不开启构建过程中的警告信息，开启之后配合，DuplicatePackageCheckerPlugin 可以在构建过程中检查是否有重复npm包引入
    dropConsole: true
  }
}

var utils = require('./utils.js');


const _ = {};
module.exports = _;

_.get = function() {
  if (chameleonConfig.base) {
    let baseConfig = chameleonConfig.base;
    let platforms = chameleonConfig.platforms;
    let extPlatform = chameleonConfig.extPlatform || {};
    platforms = platforms.concat(Object.keys(extPlatform));
    platforms.forEach(platform => {
      if (chameleonConfig[platform]) {
        let base = JSON.parse(JSON.stringify(baseConfig));
        let newConfig = JSON.parse(JSON.stringify(chameleonConfig[platform]));
        utils.merge(base, newConfig);
        chameleonConfig[platform] = base;
      }
    })
  }
  return chameleonConfig;
}


_.merge = function(mergeConfig) {
  chameleonConfig = utils.merge(chameleonConfig, mergeConfig);
  return chameleonConfig;
}

_.assign = function(mergeConfig) {
  chameleonConfig = Object.assign(chameleonConfig, mergeConfig);
  return chameleonConfig;
}


