const ipc = require('electron').ipcMain
const path = require('path')
const os = require('os')
const fs = require('fs')

let browserIPC, webcontentIPC

const configFilename = path.join(os.homedir(), '.hbook')
let books, settings, collections, tags

try {
  const data = fs.readFileSync(configFilename, 'utf8')
  const info = JSON.parse(data)
  if (info.library) {
    books = info.library
    settings = info.settings
    if (info.collections) {
      collections = info.collections
      tags = info.tags
    } else {
      collections = [
        {id: 1, title: "default"}
      ]
      tags = []
    }
  } else {
    books = info
    settings = { lang: 'en' }
  }
} catch (err) {
  books = []
  console.error(err)
}

function saveBooks() {
  try {
    fs.writeFile(configFilename, JSON.stringify({ library: books, settings, collections, tags }), err => {
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
    urls: [
      {
        url: args.url,
        scroll: 0
      }
    ],
    urlindex: 0,
    collection: args.collection
  }
  books.push(book)
  event.sender.send('book-added', book)
  console.log('add-book', args)
  saveBooks()
})

ipc.on('add-collection', (event, args) => {
  const collection = {
    id: collections.reduce((m, c) => Math.max(m, c.id), 0) + 1,
    title: args
  }
  collections.push(collection)
  console.log('add-collection', JSON.stringify(collections))
  saveBooks()
})

ipc.on('remove-book', (event, args) => {
  books.splice(args, 1)
  console.log('remove-book', args)
  event.sender.send('book-removed', args)
  saveBooks()
})

ipc.on('scroll',  (event, arg) => {
  const book = books[currentBook]
  const url = book.urls[book.urlindex]
  url.scroll = arg
  url.maxscroll = Math.max(url.maxscroll || 0, arg)
  console.log('scroll', arg, book.urls, book.urlindex)
  browserIPC.send('scroll', arg)
  saveBooks()
})

ipc.on('get-library', (event, arg) => {
  browserIPC = event.sender
  event.sender.send('send-library', {
    collections,
    books,
    settings,
    preload: 'file://'+path.resolve(path.join(__static, 'preload.js'))
  })
})

ipc.on('update-book', (event, args) => {
  currentBook = args.index
  const book = books[args.index]
  if (args.key === 'url') {
    const book = books[currentBook]
    let index = book.urls.map(item => item.url).indexOf(args.value.url)
    if (index === -1) {
      book.urls.push({url: args.value.url, scroll: args.value.scroll})
      index = book.urls.length - 1
      book.urlindex = index
    }
    let url = book.urls[index]
    url = {
      url: args.value.url || url.url, 
      scroll: args.value.scroll !== null ? args.value.scroll : url.scroll}
  } else {
    books[args.index][args.key] = args.value
  }

  console.log('update-book', book, currentBook)
  saveBooks()
})

ipc.on('update-book-url-index', (event, args) => {
  console.log('index update', args)
  books[currentBook].urlindex = args
  saveBooks()
})

ipc.on('current-book', (event, args) => {
  console.log('current-book', args)
  currentBook = args
})

ipc.on('add-bookmark', (event, args) => {
  const book = books[args.index]
  book.bookmarks = book.bookmarks || []
  const { phrase, note } = args
  const url = book.urls[book.urlindex].url
  const scroll = book.urls[book.urlindex].scroll
  const bookmark = {
    phrase,
    note,
    url,
    scroll
  }
  book.bookmarks.push(bookmark)
  event.sender.send('bookmark-added', bookmark)
  console.log('add-bookmark', book)
  saveBooks()
})

ipc.on('setscroll', (event, arg) => {
  console.log('setscroll', arg)
  if (webcontentIPC)
    webcontentIPC.send('setscroll', arg)
})

ipc.on('webview-loaded', (event, arg) => {
  webcontentIPC = event.sender
})

ipc.on('save-lang', (event, arg) => {
  if (arg.mode === 'global') {
    settings.lang = arg.lang
    console.log('saved language', settings)
  } else {
    const book = books[currentBook]
    book.lang = arg.lang
    console.log('saved language', book)
  }
  saveBooks()
})
