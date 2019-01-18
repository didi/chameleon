import * as mutationTypes from './mutation-types'
import * as actionTypes from './action-types'

export default {
  [actionTypes.INDEX_ADD_TODOS]({commit, state}, something) {
    if (!something) {
      return ;
    }
    let tods = state.index.todos;
    tods.push({
      text: something,
      completed: false
    })
    commit(mutationTypes.INDEX_CHANGE_TODOS, tods);
  },
  [actionTypes.INDEX_DELETE_TODOS]({commit, state}, index) {
    let tods = state.index.todos;
    tods.splice(index, 1);
    commit(mutationTypes.INDEX_CHANGE_TODOS, tods);
  },
  [actionTypes.INDEX_TOP_TODOS]({commit, state}, index) {
    let tods = state.index.todos;
    let d = tods.splice(index, 1);
    tods.unshift(d[0]);
    commit(mutationTypes.INDEX_CHANGE_TODOS, tods);
  },
  [actionTypes.INDEX_CHANGE_TODOS_STATUS]({commit, state}, {index, status}) {
    let tods = state.index.todos;
    tods[index].completed = status;
    commit(mutationTypes.INDEX_CHANGE_TODOS, tods);
  },
  [actionTypes.INDEX_CHANGE_TODOS_CLEAR_COMPLETED]({commit, state}) {
    let tods = state.index.todos;
    tods = tods.filter(item => {
      return !item.completed;
    })
    commit(mutationTypes.INDEX_CHANGE_TODOS, tods);
  }
}
