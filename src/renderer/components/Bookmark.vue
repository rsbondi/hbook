<template>
  <div class="content">
    <h3>Bookmark</h3>
    <div class="close" @click="close">
      x
    </div>
    <div v-if="phrase">
      <h4></h4>
      <div>{{phrase}}</div>
    </div>
    <div>
      <h4>Note:</h4>
      <textarea v-model="note" rows="10"></textarea>
    </div>
    <div>
      <button @click="addBookmark">Add</button>
    </div>
  </div>
</template>

<script>
import EventMixin from '../eventMixin'
export default {
  props: {
    phrase: String,
    close: Function,
  },
  mixins: [ EventMixin ],
  data() {
    return {
      note: "",
    }
  },
  methods: {

    addBookmark() {
      this.$electron.ipcRenderer.send('add-bookmark', { 
        phrase: this.phrase, 
        note: this.note ,
        index: this.$store.state.library.currentBook,
      })
    },
    bookmarkAddedEvent(e, arg) {
      this.$store.dispatch('add_bookmark', arg)
      this.close()
    }
  },
  mounted() {
    this.addEvent("bookmark-added", this.bookmarkAddedEvent)
  },
}
</script>

<style scoped>

.content {
  max-height: 400px;
  overflow: auto;
}
textarea {
  width: 100%;
  box-sizing: border-box;
}
button {
  float: right;
  margin-top: 2em;  
  background-color: #66aa66;
  outline: 0;
  border: 0;
  color: white;
  font-weight: 600;
  padding: 0.6em 1em;
  cursor: pointer;  
}
</style>