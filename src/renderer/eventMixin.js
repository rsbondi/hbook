export default {
  methods: {
    addEvent(event, handler) {
      this.$electron.ipcRenderer.on(event, handler)
      this.listeners.push({
        type: event,
        listener: handler
      })
    }
  },
  data() {
    return {
      listeners: [],
    };
  },
  beforeDestroy() {
    this.listeners.forEach(l => {
      this.$electron.ipcRenderer.removeListener(l.type, l.listener)
    })
  }
}