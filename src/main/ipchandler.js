const ipc = require('electron').ipcMain
const path = require('path')
const os = require('os')
const fs = require('fs')
let browserIPC, webcontentIPC

const configFilename = path.join(os.homedir(), '.hbook')
let books

try {
  const data = fs.readFileSync(configFilename, 'utf8')
  console.log(data)
  books = JSON.parse(data) 
} catch (err) {
  console.error(err)
}

console.log('books initialized', books)

function saveBooks() {
  try {
    fs.writeFile(configFilename, JSON.stringify(books), err => {
      if (err) {
        console.log(err);
      }
    });
  } catch(e) {
    console.log(e)
  }
}

let currentBook = 0

ipc.on('add-book',  (event, args) => {
  const book = {
    title: args.title,
    baseUrl: args.url,
    currentUrl: args.url,
    currentY: 0,
    highlights: []
  }
  books.push(book)
  event.sender.send('book-added', book)
  saveBooks()
})

ipc.on('scroll',  (event, arg) => {
  books[currentBook].currentY = arg
  console.log('books', books)
  saveBooks()
})

ipc.on('get-library', (event, arg) => {
  browserIPC = event.sender
  event.sender.send('send-library', {
    books:books,
    preload: 'file://'+path.resolve(path.join(__dirname, 'preload.js'))
  })
})

ipc.on('update-book', (event, args) => {
  currentBook = args.index
  books[args.index][args.key] = args.value
  books[args.index].currentY = 0
  console.log('update-book', books, currentBook)
  saveBooks()
})

ipc.on('current-book', (event, args) => {
  console.log('current-book', args)
  currentBook = args
} )

ipc.on('setscroll', (event, arg) => {
  if (webcontentIPC)
    webcontentIPC.send('setscroll', arg)
})

ipc.on('webview-loaded', (event, arg) => {
  webcontentIPC = event.sender
})
