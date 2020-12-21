const state = {
  currentBook: -1,
  books: [],
  preload: ""
}

const mutations = {
  set_books (state, payload) {
    state.books = payload
  },
  set_current_book (state, payload) {
    state.currentBook = payload
  },
  set_preload (state, payload) {
    state.preload = payload
  },
  add_book (state, payload) {
    state.books.push(payload)
  },
  update_book (state, payload) {
    state.books[payload.index][state.key] = state.value
  },
  remove_book (state, payload) {
    state.books.splice(payload, 1)
  }
}

const actions = {
  set_books ({ commit }, payload) {
    commit('set_books', payload)
  },
  set_current_book ({ commit }, payload) {
    commit('set_current_book', payload)
  },
  set_preload ({ commit }, payload) {
    commit('set_preload', payload)
  },
  add_book ({ commit }, payload) {
    commit('add_book', payload)
  },
  update_book ({ commit }, payload) {
    commit('update_book', payload)
  },
  remove_book ({ commit }, payload) {
    commit('remove_book', payload)
  },
}

export default {
  state,
  mutations,
  actions
}
