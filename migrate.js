const path = require('path')
const os = require('os')
const fs = require('fs')
const {db, DB_LANG_TYPE} = require('./src/main/db')

const configFilename = path.join(os.homedir(), '.hbook')
let books, settings

try {
  const data = fs.readFileSync(configFilename, 'utf8')
  const info = JSON.parse(data)
  if (info.library) {
    books = info.library
    settings = info.settings
  } else {
    books = info
    settings = { lang: 'en' }
  }
} catch (err) {
  books = []
  console.error(err)
  return
}

migrate(books, settings)

async function migrate(books, settings) {
  await db.create()
  await db.setGlobalLanguage(settings.lang)
  const collection = await db.setCollection('default')
  for (var b=0; b<books.length; b++) {
    const book = books[b]
    let {sourceId, urlId} = await db.addSource(collection.id, book.title, book.urls[0].url)
    for (var u=0; u<book.urls.length; u++) {
      const url = book.urls[u]
      if (u !== 0) {
        let urlInsert = await db.addUrl(sourceId, url.url)
        urlId = urlInsert.id
      } 
      const {scroll, maxscroll} = url
      await db.updateUrl(urlId, scroll, maxscroll)
      if(u === book.urlindex) {
        db.updateSource(sourceId, urlId)
      }
    }
  }

  console.log('done creating db')
  db.close()
}



