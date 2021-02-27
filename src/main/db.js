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
    return this.getLanguage('NULL', DB_LANG_TYPE.GLOBAL)
  }

  getLanguage(sourceId, sourceType) {
    return new Promise(async (resolve, reject) => {
      try {
        const src = sourceId==='NULL' ? ' IS NULL' : `=${sourceId}`
        const query = `SELECT * FROM language WHERE source_id${src} AND source_type=${sourceType}`
        const source = await this.queryAsync(query)
        resolve(source)
      } catch (err) {
        console.error(err.message)
        reject(err)
      }
    })
  }

  setGlobalLanguage(lang) {
    return this.setLanguage('NULL', DB_LANG_TYPE.GLOBAL, lang)
  }

  setLanguage(sourceId, sourceType, lang) {
    return new Promise(async (resolve, reject) => {
      try {
        const source = await this.getGlobalLanguage()
        let query
        if (source.length) {
          query = `UPDATE language SET label='${lang}' WHERE source_type=${sourceType} AND source_id=${sourceId}`
        } else {
          query = `INSERT INTO language VALUES (${sourceId}, ${sourceType}, '${lang}')`
        }
        await this.runAsync(query)
        resolve()
      } catch (err) {
        console.error(err.message)
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
      console.log(`running query async: ${statement}`)
      this.db.run(statement, params, function(err) {
        if (err) reject(err)
        else {
          console.log(`resolving statement: ${statement}`)
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