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
  },  
  computed: {
    bookmarks() {
      return this.$store.getters.book.bookmarks || []
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