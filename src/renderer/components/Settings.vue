<template>
<div class="settings">
    <div class="close" @click="close">
      x
    </div>

  <label>language</label>
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
        this.$store.getters.book.lang || 'en'
    }
  },
  methods: {
    saveSettings() {
      const settings = { mode: this.mode, lang: this.lang }
      this.$store.dispatch('set_setting_lang', settings)
      this.$electron.ipcRenderer.send("save-lang", settings)
      this.close()
    }
  }
}
</script>