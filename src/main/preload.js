const { ipcRenderer, contextBridge } = require('electron')
let scrollTimer

document.addEventListener('scroll', e => {
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    ipcRenderer.send('scroll', window.scrollY)
  }, 1000)
})

ipcRenderer.on('setscroll', (event, arg) => {
  window.scroll(0, arg)
})

ipcRenderer.send('webview-loaded')

