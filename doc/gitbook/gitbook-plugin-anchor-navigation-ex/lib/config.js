require('./log');

const defaultConfig = {
    // 标题是否显示层级序号
    showLevel: true,
    // 页面内的序号是否与 summary.md 中官方默认主题生成的序号相关联
    associatedWithSummary: true,
    printLog: false,  // 是否打印日志，就如同自己使用了prism，但是很容易写错他的定义，比如css写成了csss,文章太多的话，生成出错，但是找不到是那篇文章，打开该选项就能定位了
    multipleH1: true, // 多H1模式么？一般正常的文章一个md文件只有一个H1标题，这个时候就适合关闭该选项，生成的标题不会多一个 1. 出来
    // 模式：分为三种：float：浮动导航、pageTop：页面内部顶部导航、null:不显示导航
    mode: "float",
    showGoTop: true, //是否显示返回顶部摁扭
    float: { //浮动导航设置
        floatIcon: "fa fa-navicon",
        showLevelIcon: false,  //是否显示层级图标
        level1Icon: "fa fa-hand-o-right",
        level2Icon: "fa fa-hand-o-right",
        level3Icon: "fa fa-hand-o-right"
    },
    pageTop: {
        showLevelIcon: false,  //是否显示层级图标
        level1Icon: "fa fa-hand-o-right",
        level2Icon: "fa fa-hand-o-right",
        level3Icon: "fa fa-hand-o-right"
    },
    // 官方默认主题 层级开关
    themeDefault: {
        showLevel: false
    }
}

/**
 * 处理默认参数
 * @param defaultConfig
 * @param config
 */
function handler(defaultConfig, config) {
    if (config) {
        for (var item in defaultConfig) {
            if (item in config) {
                defaultConfig[item] = config[item];
            }
        }
    }
}
/**
 * 处理所有的配置参数
 * @param bookIns
 */
function handlerAll(bookIns) {
    var config = bookIns.config.get('pluginsConfig')['anchor-navigation-ex'];
    var themeDefaultConfig = bookIns.config.get('pluginsConfig')['theme-default'];
    handler(defaultConfig, config);
    handler(defaultConfig.themeDefault, themeDefaultConfig);

    if (config.isRewritePageTitle) {
        console.error("error:".error +
            "plugins[anchor-navigation-ex]：isRewritePageTitle 配置只支持0.3.x 版本，" +
            "请到https://github.com/zq99299/gitbook-plugin-anchor-navigation-ex查看最新版本的配置项");
        console.log("");
        console.error("error:".error +
            "plugins[anchor-navigation-ex]：isRewritePageTitle Configuration only supports 0.3.x version，" +
            "Please check here https://github.com/zq99299/gitbook-plugin-anchor-navigation-ex  for the latest version of the configuration item");
    }
}
/**
 * 本类中 config 单例共享
 * @type {{config: {showLevel: boolean, associatedWithSummary: boolean, mode: string, float: {showLevelIcon: boolean, level1Icon: string, level2Icon: string, level3Icon: string}, top: {showLevelIcon: boolean, level1Icon: string, level2Icon: string, level3Icon: string}, themeDefault: {showLevel: boolean}}, handler: handler, handlerAll: handlerAll}}
 */
module.exports = {
    config: defaultConfig,
    handler: handler,
    handlerAll: handlerAll
}
