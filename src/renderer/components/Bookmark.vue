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
export default {
  props: {
    phrase: String,
    close: Function,
  },
  data() {
    return {
      note: ""
    }
  },
  methods: {
    addBookmark() {
      this.$electron.ipcRenderer.send('add-bookmark', { 
        phrase: this.phrase, 
        note: this.note ,
        index: this.$store.state.library.currentBook,
      })
      this.close()
    }
  }

}
</script>

<style scoped>
.close {
  position: absolute;
  right: 8px;
  top: 6px;
  z-index: 42;
  background-color: antiquewhite;
  font-size: 30px;
  height: 30px;
  width: 30px;
  color: red;
  padding: 4px 0 11px 15px;
  border: 1px solid red;
  cursor: pointer;
}
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