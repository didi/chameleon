
/*global Vue*/
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// 根据配置生成的路由options
const routerOptions = '$ROUTER_OPTIONS';

routerOptions.mode = process.env.platform === 'web' ? routerOptions.mode : 'abstract';

const Router = new VueRouter(routerOptions)
export default Router
