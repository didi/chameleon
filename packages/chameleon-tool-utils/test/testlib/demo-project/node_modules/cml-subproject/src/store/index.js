import actions from './actions'
import getters from './getters'
import state from './state'
import mutations from './mutations'
import createStore from "chameleon-store";

export default createStore({
  actions,
  getters,
  state,
  mutations
})
