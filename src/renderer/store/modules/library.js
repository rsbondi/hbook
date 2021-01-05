const state = {
  currentBook: -1,
  books: [],
  settings: {},
  preload: ""
}

const mutations = {
  set_books (state, payload) {
    state.books = payload.books,
    state.settings = payload.settings
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
  },
  add_bookmark (state, payload) {
    const book = state.books[state.currentBook]
    book.bookmarks = book.bookmarks || []
    book.bookmarks.push(payload)
  },  
  set_scroll (state, payload) {
    const book = state.books[state.currentBook]
    book.currentY = payload
  },
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
  add_bookmark ({ commit }, payload) {
    commit('add_bookmark', payload)
  },
  set_scroll ({ commit }, payload) {
    commit('set_scroll', payload)
  }
}

const getters = {
  book: state => {
    return state.books[state.currentBook]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
