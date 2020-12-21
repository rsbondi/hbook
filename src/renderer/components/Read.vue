<template>
  <div class="wrapper">
    <div class="top-menu">
      <div @click="back">&lt;</div>
      <div @click="next">&gt;</div>
      <div @click="library">library</div>
    </div>
    <webview v-if="currentBook != -1" :src="url" :preload="preload"></webview>
  </div>
</template>

<script>
export default {
  name: "read",
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
          this.webview = document.querySelector('webview')
          this.webview.clearHistory()
  
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
</style>
