export default class Dictionary {

  constructor(settings) {
    this.endpoint = "https://api.dictionaryapi.dev/api/v2/entries"
    this.lang = settings.lang
  }

  getDefinitions(word, language) {
    return new Promise((resolve, reject) => {
      const lang = language || this.lang
      fetch(`${this.endpoint}/${lang}/${word}`)
        .then(response => {
          response.json().then(data => {
            if (Array.isArray(data)) {
              resolve(data[0].meanings)
            } else resolve(null) // ok if not found
          })
        })
    })
  }
}