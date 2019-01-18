import * as types from './mutation-types'

const mutations = {
  [types.INDEX_CHANGE_TODOS](state, todos) {
    state.index.todos = todos;
  }
}

export default mutations
