<template>
<div class="content">
    <h3>Bookmarks</h3>
    <div class="close" @click="close">
      x
    </div>
    <div v-if="!bookmarks || !bookmarks.length" class="no-bm">No bookmarks, please select text and open again to add.</div>
  <ul>
    <li v-for="(bm, index) in bookmarks" :key="index">
      <div @click="navToBookmark(index)" class="bookmark-content">
        <div v-if="bm.phrase!==''">
          <h5>text</h5>
          <div>{{bm.phrase}}</div>
        </div>
        <div v-if="bm.note!==''">
          <h5>note</h5>
          <div>{{bm.note}}</div>
        </div>
      </div>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: {
    close: Function,
    nav: Function,
  },  computed: {
    bookmarks() {
      return this.$store.state.library.books[this.$store.state.library.currentBook].bookmarks || []
    }
  },
  methods: {
    navToBookmark(index) {
      const bookmark = this.bookmarks[index]
      this.nav(bookmark.url, bookmark.scroll)
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
li {
  border: 1px solid lightgray;
  padding: 1em;
  margin-bottom: 1em;
}
.bookmark-content {
  cursor: pointer;
}
.no-bm{
  font-style: italic;
}
</style>