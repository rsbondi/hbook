<template>
<div class="settings">
    <div class="close" @click="close">
      x
    </div>

  <div>
    <div class="label">language</div>
    <select v-model="lang">
      <option value="en">English</option>
      <option value="hi">Hindi</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="ja">Japanese</option>
      <option value="ru">Russian</option>
      <option value="de">German</option>
      <option value="it">Italian</option>
      <option value="ko">Korean</option>
      <option value="pt-BR">Brazilian Portuguese</option>
      <option value="ar">Arabic</option>
      <option value="tr">Turkish</option>
    </select>
    <button @click="saveSettings">Save</button>
  </div>
  <div v-if="mode==='global'" class="item">
    <div class="label">add collection</div>
    <input v-model="title" type="text" placeholder="add collection">
    <button @click="addCollection">Add</button>
  </div>
</div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'book' // or global
    },
    close: Function,
  },
  data() {
    return {
      lang: this.mode === 'global' ?
        this.$store.state.library.settings.lang :
        this.$store.getters.book.lang || 'en',
      title: ""
    }
  },
  methods: {
    saveSettings() {
      const settings = { mode: this.mode, lang: this.lang }
      this.$store.dispatch('set_setting_lang', settings)
      this.$electron.ipcRenderer.send("save-lang", settings)
      if (this.mode==='book') this.close()
    },
    addCollection() {
      this.$store.dispatch('add_collection', this.title)
      this.$electron.ipcRenderer.send("add-collection", this.title)
      this.title = ""
    }
  }
}
</script>

<style scoped>
.label {
  width: 100px;
  display: inline-block;
}
select {
  width: 200px;
}
input {
  width: 200px;
  padding: 7px;
  margin-bottom: 8px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.item{
  margin-top: 1em;
}
</style>