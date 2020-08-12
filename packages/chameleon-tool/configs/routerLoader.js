const path = require('path');
const cmlUtils = require('chameleon-tool-utils');
const loaderUtils = require('loader-utils');

const filterRouter = function(routerConfig, params, type) {
  let mpa = routerConfig.mpa;
  let query = params.query;
  if (mpa && mpa[`${type}Mpa`] && Array.isArray(mpa[`${type}Mpa`])) {
    // 处理 routerConfig.routes
    let currentRoute = (mpa[`${type}Mpa`][query] && mpa[`${type}Mpa`][query].paths) || [];
    routerConfig.routes = routerConfig.routes.filter((route) => currentRoute.includes(route.path))
  }

}
module.exports = function(content) {
  this.cacheable(false);
  let currentType = this.options.name || 'web';

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
    if (['web', 'weex'].includes(currentType) && this.resourceQuery) {
      let params = loaderUtils.parseQuery(this.resourceQuery);
      filterRouter(routerConfig, params, currentType)
    }
    routerConfig.routes.forEach(item => {
      let usedPlatforms = item.usedPlatforms;
      if (!usedPlatforms || (usedPlatforms && usedPlatforms.includes(currentType))) {
        let {dynamic, chunkName} = item;
        if (dynamic == '1' && currentType === 'web') {
          if (chunkName && typeof chunkName === 'string') {
            routerList += `
            {
              path: "${item.url}",
              name: "${item.name}",
              component: () => import(/*  webpackChunkName: '${chunkName}' */
              "$PROJECT/src${item.path}.cml")
            },
            `
          } else {
            routerList += `
            {
              path: "${item.url}",
              name: "${item.name}",
              component: () => import("$PROJECT/src${item.path}.cml")
            },
            `
          }
        } else {
          routerList += `
          {
            path: "${item.url}",
            name: "${item.name}",
            component: require("$PROJECT/src${item.path}.cml").default
          },
          `
        }
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
            let {dynamic, chunkName} = item;
            if (dynamic == 1 && currentType === 'web') {
              if (chunkName && typeof chunkName === 'string') {
                routerList += `
                  {
                    path: "${item.url}",
                    name: "${item.name}",
                    component: () => import(/*  webpackChunkName: '${chunkName}' */ "${cmlFilePath}")
                  },
                `
              } else {
                routerList += `
                  {
                    path: "${item.url}",
                    name: "${item.name}",
                    component: () => import("${cmlFilePath}")
                  },
                `
              }
            } else {
              routerList += `
              {
                path: "${item.url}",
                name: "${item.name}",
                component: require("${cmlFilePath}").default
              },
            `
            }

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
