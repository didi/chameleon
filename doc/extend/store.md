# 状态管理
## 数据管理 createStore
创建返回数据store实例
## store实例方法
### `Store.commit(type: string, payload?: any)`
提交 mutation。[详细介绍](https://cml.js.org/doc/api/store/commit.html)

### `Store.dispatch(type: string, payload?: any)`
分发 action。[详细介绍](https://cml.js.org/doc/api/store/dispatch.html)

### `Store.mapState(map: Array<string> | Object<string>): Object`
为组件创建计算属性以返回 store 中的状态。[详细介绍](https://cml.js.org/doc/api/store/mapState.html)

### `Store.mapGetters(map: Array<string> | Object<string>): Object`
为组件创建计算属性以返回 getter 的返回值。[详细介绍](https://cml.js.org/doc/api/store/mapGetters.html)

### `Store.mapMutations(map: Array<string> | Object<string>): Object`
创建组件方法提交 mutation。[详细介绍](https://cml.js.org/doc/api/store/mapMutations.html)

### `Store.mapActions(map: Array<string> | Object<string>): Object`
创建组件方法分发 action。[详细介绍](https://cml.js.org/doc/api/store/mapActions.html)

### `Store.registerModule(path: String, module: Module)`
注册一个动态模块。[详细介绍](https://cml.js.org/doc/api/store/registerModule.html)

