<template>
  <div class="content">
    <h3>{{word}}</h3>
    <div class="close" @click="close">
      x
    </div>
    <ul>
      <li v-for="(meaning, index) in defs" :key="index">
        <em>{{meaning.partOfSpeech}}:</em> 
        <div v-for="(def, d) in meaning.definitions" :key="d">-- {{def.definition}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    definitions: Array|null,
    word: String,
    close: Function,
  },
  computed: {
    defs() {
      return this.definitions || []
    }
  }
}
</script>

<style scoped>
li, li div {
  padding-top: 1em;
}
li div:first-child {
  padding-top: 0;
}
em {
  font-weight: 600;
}
.content {
  max-height: 400px;
  overflow: auto;
}
</style>