const path = require('path');
const cmlUtils = require('chameleon-tool-utils');
const config = require('./config')
module.exports = function(content) {
  let currentType = 'web';
  let configNodes = Object.keys(config.nodeConfiguration);
  const union = Object.keys(this.options.node).filter((v) => configNodes.includes(v));
  if (union.length === configNodes.length) {
    currentType = 'weex'
  }
  const context = (
    this.rootContext ||
    (this.options && this.options.context) ||
    process.cwd()
  )
  this.addDependency(path.join(context, './src/router.config.json'));

  let {routerConfig, hasError} = cml.utils.getRouterConfig();
  if (hasError) {
    throw new Error(`${path.join(context, './src/router.config.json')} json 格式有误`);
  } else {
    let mode = routerConfig.mode;
    let routerList = '';
    routerConfig.routes.forEach(item => {
      let usedPlatforms = item.usedPlatforms;
      if (!usedPlatforms || (usedPlatforms && usedPlatforms.includes(currentType))) {
        routerList += `
        {
          path: "${item.url}",
          name: "${item.name}",
          component: require("$PROJECT/src${item.path}.cml").default
        },
        `
      }
    })

    // subProject 中的页面
    let subProject = cml.config.get().subProject;
    if (subProject && subProject.length > 0) {
      subProject.forEach(function(item) {
        let npmName = cmlUtils.isString(item) ? item : item.npmName;
        let npmRouterConfig = cml.utils.readsubProjectRouterConfig(cml.projectRoot, npmName);
        npmRouterConfig.routes && npmRouterConfig.routes.forEach(item => {
          let cmlFilePath = path.join(cml.projectRoot, 'node_modules', npmName, 'src', item.path + '.cml');
          let usedPlatforms = item.usedPlatforms;
          if (!usedPlatforms || (usedPlatforms && usedPlatforms.includes(currentType))) {
            routerList += `
            {
              path: "${item.url}",
              name: "${item.name}",
              component: require("${cmlFilePath}").default
            },
            `
          }
        })
      })
    }

    let routerTemplate = `
    //根据配置生成路由
    {
      mode: "${mode}",
      routes: [${routerList}]
    }    
    `;
    content = content.replace('\'$ROUTER_OPTIONS\'', routerTemplate)
  }
  return content;
}
