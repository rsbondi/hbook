<template>
  <div>
    <div class="top-menu">
      <div @click="toggleSettings">⚙</div>
    </div>
    <div v-if="showSettings">
      <Settings mode="global"  :close="() => showSettings=false"/>
    </div>
    <div class="library">

      <div class="lib-wrapper">
        <h2>Library</h2>
        <div v-for="collection in collections" :key="collection.id">
          <CollectiionList :collection="collection"/>
        </div>

        <button @click="showBookForm=!showBookForm">+</button>
        <div class="book-form" v-if="showBookForm">
          <input v-model="title" type="text" placeholder="title">
          <input v-model="url" type="text" placeholder="url">
          <label>collection:</label> <select v-model="collection">
            <option v-for="collection in collections" :key="collection.id" :value="collection.id">
              {{collection.title}}
            </option>
          </select>
          <button @click="addBook">Add Book</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventMixin from '../eventMixin'
import Settings from './Settings.vue'
import CollectiionList from './CollectionList'

export default {
  name: 'library',
  mixins: [ EventMixin ],
  components: { Settings, CollectiionList },
  methods: {
     addBook() {
      if (this.title !== "" && this.url !== "")
        this.$electron.ipcRenderer.send("add-book", { title: this.title, url: this.url, collection: this.collection })
        this.title = ""
        this.url = ""    
    },
    sendLibraryEvent(e, arg) {
      this.$store.dispatch('set_books', { collections: arg.collections, books: arg.books, settings: arg.settings })
      this.$store.dispatch('set_preload', arg.preload)
    },
    bookAddedEvent(e, arg) {
      this.$store.dispatch('add_book', arg)
    },
    bookRemovedEvent(e, arg) {
      this.$store.dispatch('remove_book', arg)
    },
    toggleSettings() {
      this.showSettings = !this.showSettings
    }
  },
  mounted() {
    this.$electron.ipcRenderer.send("get-library");

    this.addEvent("send-library", this.sendLibraryEvent)
    this.addEvent("book-added", this.bookAddedEvent)
    this.addEvent("book-removed", this.bookRemovedEvent)
  },
  computed: {
    collections() {
      return this.$store.getters.collectionLib
    },
    books() {
      return this.$store.state.library.books
    },
    currentBook() {
      return this.$store.state.library.currentBook
    }
  },
  data () {
    return {
      showBookForm: false,
      title: "",
      url: "",
      collection: 1,
      showSettings: false,
    }
  },
}
</script>

<style>

  .book-form input {
    width: 100%;
    padding: 12px 20px;
    margin-bottom: 8px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .library {
    display: flex;
    justify-content: center;
  }

  .lib-wrapper {
    width: 400px;
  }

  .library button {
    margin-bottom: 1em;
    background-color: #66aa66;
    outline: 0;
    border: 0;
    color: white;
    font-weight: 600;
    padding: 0.6em 1em;
    cursor: pointer;
  }

  .book-form button {
    float: right;
    margin-top: 0.3em;
    background-color: dodgerblue;
  }

  .book-form {
    border: 1px solid lightgray;
    border-radius: 5px;
    box-sizing: content-box;
    padding: 0.5em 0.5em 3em 0.5em;
  }

  .title {
    width: 352px;
  }

  .book button {
    padding: 0.2em 0.4em;
    background-color: white;
    color: darkred;
    border: 1px solid;
    border-radius: 3px
  }
</style>