<template>
  <div class="wrapper">
    <div class="top-menu">
      <div @click="back">&lt;</div>
      <div @click="next">&gt;</div>
      <div @click="library">library</div>
      <div class="lib-title">{{title}}</div>
    </div>
    <div v-if="definitions" class="definitions">
      <Definitions :word="word" :definitions="definitions" :close="() => definitions=null"/>
    </div>
    <webview v-if="currentBook != -1" :src="url" :preload="preload"></webview>
  </div>
</template>

<script>
import Dictionary from '../dictionary'
import Definitions from './Definitions.vue';

const dictionary = new Dictionary()

export default {
  name: "read",
  components: { Definitions },
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
    addEvent(event, handler) {
      const listener = handler
      this.webview.addEventListener(event, listener)
      this.listeners.push({
        type: event,
        listener: listener
      })
    },
    didNavigate(event) {
      this.$store.dispatch('update_book', {index: this.currentBook, key:'currentUrl', value: event.url})
      this.$store.dispatch('update_book', {index: this.currentBook, key:'currentY', value: 0})

      this.$electron.ipcRenderer.send("update-book", {
        index: this.currentBook, 
        key: 'currentUrl', 
        value: event.url
      });

    }
  },
  watch: {
    currentBook() {
      if (this.currentBook !== -1) {
        
        setTimeout(() => {
          this.$electron.ipcRenderer.send('current-book', this.currentBook)
          this.url = this.books[this.currentBook].currentUrl
          this.title = this.books[this.currentBook].title
          this.webview = document.querySelector('webview')
          this.webview.clearHistory()
          this.addEvent('ipc-message', (e) => {
            if (e.channel === 'word-selected') {
              const word = e.args[0]
              dictionary.getDefinitions(word).then(definitions => {
                this.word = word
                this.definitions = definitions
              })
            } else this.word = ""
          })
  
          this.addEvent('did-navigate', this.didNavigate)
          this.addEvent('did-navigate-in-page', this.didNavigate)
          this.addEvent('dom-ready', event => {
            if(this.currentBook === -1) return
            this.$electron.ipcRenderer.send('setscroll', this.books[this.currentBook].currentY)
          })

        }, 200)  
      }
    }
  },
  data() {
    return {
      url: "about:blank",
      listeners: [],
      title: "",
      lang: "en",
      definitions: null,
      word: "",

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
    this.listeners.forEach(l => {
      this.webview.removeEventListener(l.type, l.listener)
    })
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

  .definitions {
    position: absolute;
    padding: 2em;
    border: 1px solid lightgray;
    background-color: antiquewhite;
    width: 100%;
    box-sizing: border-box;
  }
</style>
