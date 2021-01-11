<template>
  <div class="wrapper">
    <div class="top-menu">
      <div @click="back">&lt;</div>
      <div @click="next">&gt;</div>
      <div @click="library">library</div>
      <div @click="showBookmark=!showBookmark">⭐</div>
      <div @click="toggleSettings">⚙</div>
      <div class="lib-title">{{title}}</div>
    </div>
    <div v-if="definitions" class="definitions">
      <Definitions :word="word" :definitions="definitions" :close="() => definitions=null"/>
    </div>
    <div v-if="showSettings">
      <Settings :close="() => showSettings=false"/>
    </div>
    <div v-if="showBookmark" class="bookmark">
      <div v-if="selection!==''">
        <Bookmark :phrase="selection" :close="() => showBookmark=false" />
      </div>
      <div v-else>
        <Bookmarks :nav="goBookmark" :close="() => showBookmark=false" />
      </div>
    </div>
    <webview v-if="currentBook != -1" :src="url" :preload="preload"></webview>
  </div>
</template>

<script>
import Dictionary from '../dictionary'
import Definitions from './Definitions.vue';
import Bookmark from './Bookmark'
import Bookmarks from './Bookmarks.vue';
import Settings from './Settings.vue'
import EventMixin from '../eventMixin'

let dictionary

export default {
  name: "read",
  components: { Definitions, Bookmark, Bookmarks, Bookmarks, Settings },
  mixins: [EventMixin],
  methods: {
    // TODO: scroll position for history
    back() {
      this.webview.goBack()
    },
    next() {
      this.webview.goForward()
    },
    library() {
      this.$store.dispatch('set_current_book', -1)
      this.$router.push('/')
    },
    addWebviewEvent(event, handler) {
      const listener = handler
      this.webview.addEventListener(event, listener)
      this.wvlisteners.push({
        type: event,
        listener: listener
      })
    },
    didNavigate(event) {
      const book = this.books[this.currentBook]
      const urlindex = book.urls.map(item => item.url).indexOf(event.url)
      let scroll = 0
      if (urlindex > -1) {
        scroll = book.urls[urlindex].scroll
      }
      const payload = {index: this.currentBook, key:'url', value: {
        url: event.url,
        scroll
      }}
      this.$store.dispatch('update_book', payload)
      this.$store.dispatch('update_book_url_index', urlindex)

      this.$electron.ipcRenderer.send("update-book", payload);
      this.$electron.ipcRenderer.send("update-book-url-index", urlindex);
      this.url = event.url
      this.$store.dispatch('set_scroll', scroll)

    },
    handleMessage(e) {
      this.selection = ""
      this.word = ""
      if (e.channel === 'word-selected') {
        const word = e.args[0]
        const lang = this.$store.getters.book.lang || this.$store.state.library.settings.lang
        if (word) dictionary.getDefinitions(word, lang).then(definitions => {
          this.word = word
          this.definitions = definitions
        })
      } else if (e.channel === 'phrase-selected') {
        this.selection = e.args[0]
        this.showBookmark = true
      } 
    },
    handleScroll(event) {
      if(this.currentBook === -1) return
      const book = this.books[this.currentBook]
      // const index = book.urls.map(item => item.url).indexOf(this.url)
      this.$store.dispatch('update_book', {index: this.currentBook, key:'urlindex', value: book.urlindex})
      this.$electron.ipcRenderer.send('setscroll', book.urls[book.urlindex].scroll)
    },
    goBookmark(url, scroll) {
      const book = this.books[this.currentBook]
      const urlindex = book.urls.map(item => item.url).indexOf(url)
      this.$store.dispatch('update_book', {index: this.currentBook, key:'urlindex', value: urlindex})
      setTimeout(() => {
        this.$store.dispatch('set_scroll', scroll)
        this.url = url
        this.showBookmark = false
      }, 0)
    },
    toggleSettings() {
      this.showSettings = ! this.showSettings
    }, 
    updateScroll(event, scroll) {
      this.$store.dispatch('set_scroll', scroll)
    }
  },
  watch: {
    currentBook() {
      if (this.currentBook !== -1) {
        
        setTimeout(() => {
          this.$electron.ipcRenderer.send('current-book', this.currentBook)
          const book = this.books[this.currentBook]
          this.url = book.urls[book.urlindex].url
          this.title = book.title
          this.webview = document.querySelector('webview')
          this.webview.clearHistory()
          
          this.addWebviewEvent('ipc-message', this.handleMessage)  
          this.addWebviewEvent('did-navigate', this.didNavigate)
          this.addWebviewEvent('did-navigate-in-page', this.didNavigate)
          this.addWebviewEvent('dom-ready', this.handleScroll)
          this.addEvent('scroll', this.updateScroll)

        }, 200)  
      }
    }
  },
  data() {
    return {
      url: "about:blank",
      wvlisteners: [],
      title: "",
      lang: "en",
      definitions: null,
      word: "",
      selection: "",
      showBookmark: false,
      showSettings: false,
    };
  },
  computed: {
    currentBook() {
      return this.$store.state.library.currentBook
    },
    books() {
      return this.$store.state.library.books
    },
    preload() {
      return this.$store.state.library.preload
    },
    dictionaryEndpoint() {
      return `https://api.dictionaryapi.dev/api/v2/entries/${this.lang}/`
    }
  },
  beforeDestroy() {
    this.wvlisteners.forEach(l => {
      this.webview.removeEventListener(l.type, l.listener)
    })
  },
  mounted() {
    dictionary = new Dictionary(this.$store.state.library.settings)
  }
};
</script>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
  }
  webview, .wrapper {
    height: 100%;

  }
  .top-menu {
    display: flex;
    background-color: lightgray;
  }
  .top-menu > div {
    padding: 0.2em 1em;
    cursor: pointer;
  }
  .lib-title {
    position: absolute;
    right: 0;
    font-style: italic;
    color: gray;
  }

</style>
