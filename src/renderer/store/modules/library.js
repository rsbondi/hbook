const state = {
  currentBook: -1,
  currentCollection: 1,
  books: [],
  collections: [],
  settings: {},
  preload: ""
}

const mutations = {
  set_books (state, payload) {
    state.collections = payload.collections,
    state.books = payload.books,
    state.settings = payload.settings
  },
  set_current_book (state, payload) {
    state.currentBook = payload.index
    state.currentCollection = payload.collection
  },
  set_preload (state, payload) {
    state.preload = payload
  },
  add_book (state, payload) {
    state.books.push(payload)
  },
  update_book (state, payload) {
    if (payload.key === 'url') {
      const book = state.books[state.currentBook]
      let index = book.urls.map(item => item.url).indexOf(payload.value.url)
      if (index === -1) {
        book.urls.push({url: payload.value.url, scroll: payload.value.scroll})
        index = book.urls.length - 1
        book.urlindex = index
      }
      let url = book.urls[index]
      url = {
        url: payload.value.url || url.url, 
        scroll: payload.value.scroll !== null ? payload.value.scroll : url.scroll}
    } else {
      state.books[payload.index][payload.key] = payload.value
    }
  },
  update_book_url_index (state, payload) {
    const book = state.books[state.currentBook]
    book.urlindex = payload
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
    try {
      const newBooks = [...state.books]
      const book = newBooks[state.currentBook]
      const url = newBooks[state.currentBook].urls[book.urlindex]
      url.scroll = payload
      url.maxscroll = Math.max(url.maxscroll || 0, payload)
      state.books = newBooks
    } catch (e) {
      // TODO: why is the index out of sync here on new url?
    }
  },
  set_setting_lang (state, payload) {
    if (payload.mode === 'global') {
      state.settings.lang = payload.lang
    } else {
      state.books[state.currentBook].lang = payload.lang
    }
  },
  add_collection (state, payload) {
    const collection = {
      id: state.collections.reduce((m, c) => Math.max(m, c.id), 0) + 1,
      title: payload
    }
    state.collections.push(collection)
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
  add_collection ({ commit }, payload) {
    commit('add_collection', payload)
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
  },
  set_setting_lang ({ commit }, payload) {
    commit('set_setting_lang', payload)
  },
  update_book_url_index ({ commit }, payload) {
    commit('update_book_url_index', payload)
  }
}

const getters = {
  book: state => {
    return state.books[state.currentBook]
  },
  collectionLib: state => {
    const collectionLib = state.collections.reduce((lib, col) => {
      lib.push({...col, books: []})
      return lib
    },[])
    state.books.forEach(book => {
      if (!book.collection) {
        book.collection = 1
      }
      const col = collectionLib.find(c => c.id === book.collection)
      col && col.books.push(book)
    })
    return collectionLib
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
