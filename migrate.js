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
  console.log('done creating db')
  db.close()
}



