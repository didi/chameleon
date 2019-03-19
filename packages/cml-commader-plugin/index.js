
class CMLCommander {
  constructor(options) {
  
    this.cmlType = options.cmlType; // 端的标识 例如wx baidu alipay
    // this.fileExt = { // CML部分对应生成文件后缀
    //   style: 'wxss',
    //   template: 'wxml',
    //   script: 'js',
    //   json: 'json'
    // }
    this.fileExt = options.fileExt;
    this.styleLoader = options.styleLoader; // 用户配置styleLoader
    this.cmlLoader = options.cmlLoader;  // 如果用户有能力完全重新CML文件处理
    this.postcssConfig = options.postcssConfig; //postcss的配置
    this.routerPath = options.routerPath; // 路由文件路径
    this.routerLoader = options.routerLoader; //处理路由文件的router
    this.mediaConfig = options.mediaConfig; //chameleon config
    this.babelConfig = options.babelConfig; //chameleon config
  }

  /**
   * @description 注册命令
   * @param commander 命令对象
   * @param releaseHelper 构建方法
   * */ 
  registryCommander({
    commander,
    releaseHelper
  }) {

  }

  /**
   * @description 设置webpack构建入口
   * @param entry 入口对象
   * */ 
  setWebpackEntry({entry}) {

  }

  /**
   * @description 设置webpack构建入口
   * @param compile webpack compile对象
   * */ 
  getCompile({compile}) {

  }

  /**
   * @description 设置CML文件script部分内容
   * @param content 整个CML文件
   * @param scriptContent script部分内容
   * @param loaderContext loader上下文
   * @return 返回值同步设置CML文件script部分内容
   * */ 
  setCMLScript({content, scriptContent, loaderContext}) {

  } 

  /**
   * @description 模板编译
   * @param ast 模板的jsx AST
   * @param options 编译相关参数
   * @return 返回值同步设置CML文件script部分内容
   * */ 
  templateCompile({ast, options}) {

  } 

    /**
   * @description cml文件插入基础样式
   * @param content cml文件内容
   * @param loaderContext loader上下文
   * @return 返回值同步设置CML文件style内容
   * */ 
  injectCMlBaseStyle({content, loaderContext}) {

  } 
}

module.exports = CMLCommander;