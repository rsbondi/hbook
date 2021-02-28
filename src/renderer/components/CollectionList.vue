<template>
  <div>
    <h5 @click="toggleCollection" class="collection-title">{{collection.title}}</h5>
    <ul v-show="showCollection">
      <li v-for="(book,i) in collection.books" :key="i">
        <div class="book">
          <div class="title" @click="bookSelected(i)">
            {{book.title}}
          </div>
          <button class="trash" @click="removeBook(i)">x</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    collection: Object
  },
  data() {
    return {
      showCollection: this.collection.id === 1
    }
  },
  methods: {
    bookSelected(index) {
      this.$store.dispatch('set_current_book', index)
      this.$router.push('/read')
    },
    removeBook(index) {
      this.$electron.ipcRenderer.send("remove-book", index);
    },
    toggleCollection() {
      this.showCollection = !this.showCollection
    }
  }
}
</script>

<style scoped>
  .book {
    cursor: pointer;
    color: #28f;
    padding: 0.15em 0;
    display: flex;
  }

  li {
    list-style: none;
  }
  .collection-title {
    cursor: pointer;
    color:darkolivegreen
  }
</style>