const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')
const os = require('os')

const dbfile = process.env.SQLITE_DATABASE || path.join(os.homedir(), '.hbook.db')
const DB_LANG_TYPE = {
  GLOBAL: 0,
  COLLECTION: 1,
  SOURCE: 2
}

class DataBase {
  constructor() {
    this.db = new sqlite3.Database(dbfile);
  }

  create() {
    return new Promise(async (resolve, reject) => {
      const table = await this.queryAsync("SELECT count(*) c FROM sqlite_master WHERE type='table' AND name='collection'")
      if (table[0].c) {
        resolve()
        return
      }
      const dataSql = fs.readFileSync(`${__dirname}/../reader.sql`).toString()
      const commands = dataSql.toString().split(';')
        .filter(q => q.trim())
        .map(q => q.trim())

      try {
        for (var c=0; c<commands.length; c++) {
          await this.runAsync(commands[c])
        }
      } catch (err) {
        this.runAsync('ROLLBACK')
        .then(() => reject(err))
        
        return
      }
      resolve()
    })
  }

  getGlobalLanguage() {
    return this.getLanguage(-1, DB_LANG_TYPE.GLOBAL)
  }

  getLanguage(sourceId, sourceType) {
    return new Promise(async (resolve, reject) => {
      try {
        const src = sourceId==='NULL' ? ' IS NULL' : `=${sourceId}`
        const query = `SELECT * FROM language WHERE source_id=? AND source_type=?`
        const source = await this.queryAsync(query, sourceId, sourceType)
        resolve(source)
      } catch (err) {
        console.error(err.message)
        reject(err)
      }
    })
  }

  setGlobalLanguage(lang) {
    return this.setLanguage(-1, DB_LANG_TYPE.GLOBAL, lang)
  }

  setLanguage(sourceId, sourceType, lang) {
    return new Promise(async (resolve, reject) => {
      try {
        const source = await this.getLanguage(sourceId, sourceType)
        let query, params
        if (source.length) {
          query = `UPDATE language SET label=? WHERE source_type=? AND source_id=?`
          params = [lang, sourceType, sourceId]
        } else {
          query = `INSERT INTO language (source_id, source_type, label) VALUES (?, ?, ?)`
          params = [sourceId, sourceType, lang]
        }
        await this.runAsync(query, ...params)
        resolve()
      } catch (err) {
        console.error(err.message)
        reject(err)
      }
    })
  }

  setCollection(title, id) {
    return new Promise(async (resolve, reject) => {
      try {
        let query, params
        if (id) {
          query = `UPDATE collection SET title=? WHERE id=?`
          params = [title, id]
        } else {
          query = `INSERT INTO collection (title) VALUES (?)`
          params = [title]
        }
        const insert = await this.runAsync(query, ...params)
        resolve({ id: insert && insert.lastID || -1})

      } catch(err) {
        reject(err)
      }
    })
  }

  addUrl(sourceId, url) {
    return new Promise(async (resolve, reject) => {
      try {
        const insert = await this.runAsync(`INSERT INTO url (source_id, url, scroll, maxscroll) VALUES(?, ?, 0, 0)`, sourceId, url)
        resolve({ id: insert && insert.lastID || -1})
      } catch(err) {
        reject(err)
      }
    })
  }

  addBookmark(sourceId, phrase, note, urlId, scroll) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `INSERT INTO bookmark (source_id, phrase, note, url_id, scroll) VALUES(?, ?, ?, ?, ?)`
        const insert = await this.runAsync(query, sourceId, phrase, note, urlId, scroll)
        resolve({ id: insert && insert.lastID || -1})
      } catch(err) {
        reject(err)
      }
    })
  }

  updateUrl(id, scroll, maxscroll) {
    return new Promise(async (resolve, reject) => {
      try {
        const insert = await this.runAsync(`UPDATE url SET scroll=?, maxscroll=COALESCE(?, 0) WHERE id=?`, scroll, maxscroll, id)
        resolve()
      } catch(err) {
        reject(err)
      }
    })
  }

  addSource(collection, title, url) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.runAsync('BEGIN TRANSACTION;')
        const insertSource = await this.runAsync(`INSERT INTO source (collection_id, title) VALUES(?, ?)`, collection, title)
        const sourceId = insertSource.lastID
        const urlInsert = await this.addUrl(sourceId, url)
        const urlId = urlInsert.id
        await this.runAsync(`UPDATE source SET urlindex=? WHERE id=?`, urlId, sourceId)
        await this.runAsync('COMMIT;')
        resolve({sourceId, urlId})
      } catch(err) {
        await this.runAsync('ROLLBACK;')
        reject(err)
      }
    })
  }

  updateSource(id, {urlindex, lang}) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = []
        const sets = []
        if (urlindex) {
          sets.push('urlindex=?')
          params.push(urlindex)
        }
        if (lang) {
          sets.push('lang=?')
          params.push(lang)
        }
        params.push(id)
        const insert = await this.runAsync(`UPDATE source SET ${sets.join(', ')} WHERE id=?`, ...params)
        resolve()
      } catch(err) {
        reject(err)
      }
    })    
  }

  queryAsync(statement, ...params) {
    return new Promise(async (resolve, reject) => {
      this.db.all(statement, params, function(err, rows) {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  runAsync(statement, ...params) {
    return new Promise(async (resolve, reject) => {
      this.db.run(statement, params, function(err) {
        if (err) reject(err)
        else {
          resolve(this)
        }
      })
    })
  }

  close() {
    this.db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Closed the database connection.');
    })
  }
}

module.exports = {
  db: new DataBase(),
  DB_LANG_TYPE
}