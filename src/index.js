const SqliteJSON = require('sqlite-json')
const exporter = SqliteJSON('./metadata.db')
const async = require('async')
const cleanString = require('clean-string')
const camelCase = require('camelcase')
const sanitizeHtml = require('sanitize-html')
const Firestore = require('@google-cloud/firestore')

const db = new Firestore({
  projectId: 'api-project-875720539301',
  keyFilename: './keyfile.json'
})
const booksRef = db.collection('books')
const authorsRef = db.collection('authors')
const tagssRef = db.collection('tags')

const capitalize = str => str.length
? str[0].toUpperCase() +
  str.slice(1).toLowerCase()
: '';

const NOT_SUMMARY = '630,2875,2950'
const NOT_LANGUAGE = '1758,2167,2195,2235,2388,2739,3061'
const NOT_ISBN = '3006'
const NOT_AUTHOR = '2935,2984'
const NOT_ID = `${NOT_ISBN},${NOT_LANGUAGE},${NOT_SUMMARY},${NOT_AUTHOR}`
const OFFSET = 1589
// const QUERY = `SELECT * FROM books WHERE author_sort NOT LIKE '%&%' AND id NOT IN (${NOT_ID}) LIMIT 1 OFFSET ${OFFSET}`
const QUERY = `SELECT * FROM books WHERE id NOT IN (${NOT_ISBN}) LIMIT -1 OFFSET ${OFFSET}`
// const QUERY = `SELECT * FROM books`

exporter.json(QUERY, function (err, booksResult) {
  if (err) {
    console.log('Error fetching books from DB ', err)
  }

  const booksJSON = JSON.parse(booksResult)
  console.log(`Starting import of ${booksJSON.length} books`)

  let bookIndex = 1
  async.eachSeries(booksJSON, (book, callback) => {
    console.log(`Starting book id ${book.id} (${bookIndex}/${booksJSON.length}): ${book.title}`)
    const bookDoc = {
      title: book.title,
      publicationDate: new Date(book.pubdate),
      updated: new Date(book.last_modified),
      cover: `http://biblioteca.hol.es/biblioteca/biblioteca/${book.path}/cover.jpg`
    }

    async.series({
      authors: function (callback) {
        const authors = book.author_sort.split(' & ')

        // Authors to return for Book
        const authorsObject = {}

        // Search each author and send to firebase
        authors.forEach((author, index, array) => {
          exporter.json(`SELECT authors.name FROM authors WHERE authors.sort = "${author}"`, function (err, author) {
            if (err) { callback(err) }

            // We should receive only one result
            author = JSON.parse(author)[0]
  
            if (author.name) {
              author = author.name
              const authorKey = cleanString.clean(camelCase(author))
  
              let authorName = ''
              let authorLastName = ''

              // Ex: Douglas PRESTON => { name: Douglas, lastName: Preston }
              author.split(' ').forEach(word => {
                if (isUpperCase(word)) {
                  authorLastName = authorLastName + ' ' + capitalize(word)
                } else {
                  authorName = authorName + ' ' + word
                }
              })

              authorsObject[authorKey] = new Date();

              authorsRef.doc(authorKey).set({
                  fullName: authorName.trim() + ' ' + authorLastName.trim(),
                  name: authorName.trim(),
                  lastName: authorLastName.trim()
                }, { merge: true })
                .then(() => {
                  if (index + 1 === array.length) {
                    return callback(null, authorsObject)
                  }
                })
                .catch(function (error) {
                    return callback(new Error(`Error adding author ${authorKey} to book ${book.title}`))
                  })
            } else {
              return callback(new Error(`Book ${book.title} does not have author`))
            }
          })
        })        
      },
      isbn: function(callback) {
        exporter.json(`SELECT val, type FROM identifiers WHERE identifiers.book = "${book.id}"`, function (err, identifier) {
          if (err) { return callback(err) }
          identifier = JSON.parse(identifier)
          if (identifier.length && identifier[0].type === 'isbn') {
            return callback(null, identifier[0].val)
          } else {
            return callback(new Error(`No ISBN for book ${book.title}`))
          }
        })
      },
      summary: function(callback) {
        exporter.json(`SELECT text FROM comments WHERE comments.book = "${book.id}"`, (err, comments) => {
          if (err) { return callback(err) }
          comments = JSON.parse(comments)
          if (comments.length && comments[0].text) { 
            const cleanSummary = sanitizeHtml(comments[0].text, {
              allowedTags: [],
              allowedAttributes: []
            })
            return callback(null, cleanSummary)
          }
          else { return callback(new Error(`No summary for book ${book.title}`))}
        })
      },
      language: function (callback) {
        return exporter.json(`SELECT languages.lang_code FROM languages JOIN books_languages_link ON books_languages_link.lang_code = languages.id JOIN books ON books.id = books_languages_link.book WHERE books.id = '${book.id}'`, (err, languages) => {
          if (err) { return callback(err) }
          languages = JSON.parse(languages)
          if (languages.length && languages[0].lang_code) {
            switch (languages[0].lang_code) {
              case 'spa':
                return callback(null, 'es')
                break;
              case 'eng':
                return callback(null, 'en')
                break;
              default:
                return callback(new Error(`Language ${languages[0].lang_code} unkown for book ${book.title}`))
                break;
            }
          } else {
            return callback(new Error(`No language for book ${book.title}`))
          }
        })
      },
      series: function (callback) {
        return exporter.json(`SELECT series.name FROM books LEFT JOIN books_series_link ON books.id = books_series_link.book LEFT JOIN series ON books_series_link.series = series.id WHERE books.id = '${book.id}'`, (err, series) => {
          if (err) { return callback(err) }
          series = JSON.parse(series)
          if (series.length && series[0].name) { return callback(null, series[0].name) }
          else { return callback() }
        })
      },
      source: function (callback) {
        return exporter.json(`SELECT custom_column_5.value as source FROM books JOIN books_custom_column_5_link ON books.id = books_custom_column_5_link.book JOIN custom_column_5 ON custom_column_5.id = books_custom_column_5_link.value WHERE books.id = '${book.id}'`, (err, sources) => {
          if (err) { return callback(err) }
          sources = JSON.parse(sources)
          if (sources.length && sources[0].source) { return callback(null, sources[0].source) }
          else { return callback() }
        })
      },
      links: function (callback) {
        return exporter.json(`SELECT LOWER(data.format) as format, 'http://biblioteca.hol.es/biblioteca/biblioteca/' || books.path || '/' || data.name || '.' || LOWER(data.format) as url
        FROM books JOIN data ON books.id = data.book WHERE books.id = '${book.id}'`, (err, links) => {
          if (err) { return callback(err) }
          links = JSON.parse(links)
          if (links.length) {
            const linksObj = {}
            links.forEach((link) => { linksObj[link.format] = link.url })
            return callback(null, linksObj)
          } else {
            return callback(new Error(`Book ${book.title} does not have links`))
          }
        })
      },
      tags: function (callback) {
        return exporter.json(`SELECT tags.name FROM books JOIN books_tags_link ON books.id = books_tags_link.book JOIN tags ON books_tags_link.tag = tags.id WHERE books.id = '${book.id}'`, (err, tagsResult) => {
          if (err) { return callback(err) }
          tagsResult = JSON.parse(tagsResult)
          if (tagsResult.length) {
            const tags = {}
            tagsResult.forEach((tag) => {
              let tagFormatted = cleanString.clean(tag.name)
              tagFormatted = cleanString.cleanSpecialCharacters(tagFormatted)
              tagFormatted = tagFormatted.toLowerCase()
              tags[tagFormatted] = new Date()

              tagssRef.doc(tagFormatted).set({ name: tag.name, updated: new Date() }, { merge: true })
                .catch(function (error) {
                  return callback(new Error(`Error adding tag ${tagFormatted} to book ${book.title}`))
                })
            })
            return callback(null, tags)
          } else { return callback() }
        })
      }
    }, function(err, results) {
      if (err) {
        return callback(err)
      }
      bookDoc.isbn = results.isbn
      bookDoc.authors = results.authors
      bookDoc.summary = results.summary
      bookDoc.language = results.language
      if (results.series) { bookDoc.series = results.series }
      if (results.source) { bookDoc.source = results.source }
      if (results.tags) { bookDoc.tags = results.tags }
      bookDoc.links = results.links
      // console.log(bookDoc)

      booksRef.doc(bookDoc.isbn).set(bookDoc, { merge: true })
        .then(function () {
          // console.log(`Finished book ${book.title} OK`)
          bookIndex++
          return callback()
        })
        .catch(function (error) {
          return callback(new Error(`Error adding book ${book.title}`))
        })
    });
  }, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
})

function isUpperCase(str) {
  return str === str.toUpperCase();
}