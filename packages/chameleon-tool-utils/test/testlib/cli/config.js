
/*
moduleIdType 决定webpack打包模块的id  
  number，默认的id 
  hash 利用 webpack.HashedModuleIdsPlugin()
  name 利用webpack.NamedModulesPlugin()
  chameleon 利用chameleon-webpack-plugin 中开启moduleid的处理
*/
var miniappConfig = {
  dev: {
    moduleIdType: 'name',
    definePlugin: {
      'process.env.NODE_ENV': JSON.stringify('dev')
    }
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
      './components'
    ],
    publicPath: '../../'
  }
};

var chameleonConfig = {
  platforms: ["web", "weex", "wx"],
  // devPort: 8000,
  // projectName: undefined,
  templateType: 'smarty', // 模板类型 smarty or html，决定web页面的格式与devweb服务器的类型
  isBuildInProject: false, // 是否是内置组件项目,该项目不嵌入内置组件
  devOffPlatform: [], // dev 命令关闭的端
  buildOffPlatform: [], // build 命令关闭的端
  builtinNpmName: 'chameleon-ui-builtin', // 内置组件npm包的名称
  check: {  
    enable: true,  // 是否开启接口校验
    enableTypes: []  // 接口校验支持的类型 可以开启["Object","Array","Nullable"]
  },
  cmlComponents: [   //配置node_modules中cml组件库
  ],
  proxy: {
    enable: false,
    mapremote:[]
  },
  // entry: {
  //   template: 'entry_test/entry.html',
  //   web: 'entry_test/web.js',
  //   weex: 'entry_test/weex.js'
  // },
  buildInfo: {  // 打包信息
    wxAppId: '',
    wxEntryPage: '',
    webPath: ''
  },
  enableLinter: true,
  enableGlobalCheck: false,
  globalCheckWhiteList:[ //全局校验的白名单文件 后缀匹配
  ],
  postcss: {
    rem: true,
    scale: 0.5,
    remOptions: {
      // base on 750px standard.
      rootValue: 75,
      // to leave 1px alone.
      minPixelValue: 1.01
    }
  },
  wx: miniappConfig,
  alipay: miniappConfig,
  baidu: miniappConfig,
  web: {
    dev: {
      moduleIdType: 'name',
      hot: false,
      analysis: false,
      // apiPrefix: ,
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('dev')
      }
    },
    build: {
      hash: true,
      minimize: true,
      moduleIdType: 'chameleon', 
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    },
    export: {
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
      moduleIdType: 'name',
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('dev')
      }
    },
    build: {
      minimize: true,
      hash: true,
      moduleIdType: 'chameleon', 
      definePlugin: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    },
    export: {
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
  }
}

var utils = require('../../../src/index.js');


const _ = {};
module.exports = _;

_.get = function() {
  return chameleonConfig;
}


_.merge = function( mergeConfig) {
  chameleonConfig =  utils.merge(chameleonConfig, mergeConfig);
  return chameleonConfig;
}

_.assign = function( mergeConfig) {
  chameleonConfig =  Object.assign(chameleonConfig, mergeConfig);
  return chameleonConfig;
}





