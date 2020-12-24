const { ipcRenderer, contextBridge } = require('electron')
let scrollTimer, selectTimer

document.addEventListener('scroll', e => {
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    ipcRenderer.send('scroll', window.scrollY)
  }, 1000)
})

document.addEventListener('selectionchange', e => {
  clearTimeout(selectTimer)
  selectTimer = setTimeout(() => {
    const selection = e.target.getSelection().toString();
    if (selection.split(/\s/).length === 1)
      ipcRenderer.sendToHost('word-selected', selection)
  }, 1000)
})

ipcRenderer.on('setscroll', (event, arg) => {
  window.scroll(0, arg)
})

ipcRenderer.send('webview-loaded')

