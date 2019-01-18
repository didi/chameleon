import * as types from './getter-types'

export default {
  [types.INDEX_DESC_TODOS]: function(state, getters) {
    return state.index.todos;
  }
}

