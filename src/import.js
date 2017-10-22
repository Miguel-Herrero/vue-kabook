// require('babel-register')
const SqliteJSON = require('sqlite-json')
const _ = require('lodash')
const camelCase = require('camelcase')
const cleanString = require('clean-string')
const exporter = SqliteJSON('./metadata.db')

const Firestore = require('@google-cloud/firestore')
const db = new Firestore({
  projectId: 'api-project-875720539301',
  keyFilename: './keyfile.json'
})

const booksRef = db.collection('books')
const authorssRef = db.collection('authors')
const tagssRef = db.collection('tags')

// process.on('unhandledRejection', () => {});
// process.on('rejectionHandled', () => {});

const books = []
const authors = []
const tags = []

exporter.json('SELECT * FROM books LIMIT 10', function (err, booksResult) {
  const booksJSON = JSON.parse(booksResult)

  _.forEach(booksJSON, (book) => {
    let bookId

    const bookDoc = {
      title: book.title,
      publicationDate: book.pubdate,
      updated: book.last_modified,
      cover: `http://biblioteca.hol.es/biblioteca/biblioteca/${book.path}/cover.jpg`
    }
    /** AUTHOR **/
    exporter.json(`SELECT authors.name FROM authors WHERE authors.sort = "${book.author_sort}"`, function (err, author) {
      author = JSON.parse(author)
      author = author[0].name || book.author_sort
      const authorFormatted = cleanString.clean(camelCase(author))
      bookDoc.author = {
        [authorFormatted]: new Date().getTime()
      }
      authorssRef.doc(authorFormatted).set({ fullName: author }, { merge: true }).catch(function (error) {
        console.error('Error adding author: ', bookDoc.title, authorFormatted, error)
        process.exit(1)
      })
      // authors.push({ [authorFormatted]: { fullName: author } })

      /** ISBN **/
      exporter.json(`SELECT val, type FROM identifiers WHERE identifiers.book = "${book.id}"`, function (err, identifier) {
        identifier = JSON.parse(identifier)
        if (identifier.length && identifier[0].type === 'isbn') {
          bookDoc.isbn = identifier[0].val
          bookId = identifier[0].val
        }

        /** COMMENTS */
        exporter.json(`SELECT text FROM comments WHERE comments.book = "${book.id}"`, (err, comments) => {
          comments = JSON.parse(comments)
          if (comments.length && comments[0].text) { bookDoc.summary = comments[0].text }

          /** LANGUAGE */
          exporter.json(`SELECT languages.lang_code FROM languages JOIN books_languages_link ON books_languages_link.lang_code = languages.id JOIN books ON books.id = books_languages_link.book WHERE books.id = '${book.id}'`, (err, languages) => {
            languages = JSON.parse(languages)
            if (languages.length && languages[0].lang_code) {
              if (languages[0].lang_code === 'spa') { bookDoc.language = 'es' }
              if (languages[0].lang_code === 'eng') { bookDoc.language = 'en' }
            }

            /** SERIES */
            exporter.json(`SELECT series.name FROM books LEFT JOIN books_series_link ON books.id = books_series_link.book LEFT JOIN series ON books_series_link.series = series.id WHERE books.id = '${book.id}'`, (err, series) => {
              series = JSON.parse(series)
              if (series.length && series[0].name) { bookDoc.series = series[0].name }

              /** SOURCE */
              exporter.json(`SELECT custom_column_5.value as source FROM books JOIN books_custom_column_5_link ON books.id = books_custom_column_5_link.book JOIN custom_column_5 ON custom_column_5.id = books_custom_column_5_link.value WHERE books.id = '${book.id}'`, (err, sources) => {
                sources = JSON.parse(sources)
                if (sources.length && sources[0].source) { bookDoc.source = sources[0].source }

                /** LINKS */
                exporter.json(`SELECT LOWER(data.format) as format, 'http://biblioteca.hol.es/biblioteca/biblioteca/' || books.path || '/' || data.name || '.' || LOWER(data.format) as url
                FROM books
                JOIN data ON books.id = data.book
                WHERE books.id = '${book.id}'`, (err, links) => {
                  links = JSON.parse(links)
                  if (links.length) {
                    bookDoc.links = {}
                    _.forEach(links, (link) => { bookDoc.links[link.format] = link.url })
                  }

                  /** TAGS */
                  exporter.json(`SELECT tags.name FROM books JOIN books_tags_link ON books.id = books_tags_link.book JOIN tags ON books_tags_link.tag = tags.id WHERE books.id = '${book.id}'`, (err, tagsResult) => {
                    tagsResult = JSON.parse(tagsResult)
                    if (tagsResult.length) {
                      bookDoc.tags = {}
                      _.forEach(tagsResult, (tag) => {
                        let tagFormatted = cleanString.clean(tag.name)
                        tagFormatted = cleanString.cleanSpecialCharacters(tagFormatted)
                        tagFormatted = tagFormatted.toLowerCase()
                        bookDoc.tags[tagFormatted] = new Date()

                        tagssRef.doc(tagFormatted).set({ name: tag.name, updated: new Date() }, { merge: true }).catch(function (error) {
                          console.error('Error adding a tag: ', bookDoc.title, tagFormatted, error)
                          process.exit(1)
                        })

                        // tags.push({ [tagFormatted]: { name: tag.name } })
                      })
                    }
                    books.push(bookDoc)

                    booksRef.doc(bookId).set(bookDoc, { merge: true }).catch(function (error) {
                      console.error('Error adding book: ', bookDoc.title, error)
                      process.exit(1)
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  setTimeout(function () {
    // db.collection('books').where().get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => ${doc.data()}`)
    //     console.log(doc.data())
    //   })
    // })
    booksRef.where('author.matildeAsensi', '>', 0).orderBy('author.matildeAsensi').get().then((querySnapshot) => {
      // console.log(`${querySnapshot.length} documentos`)
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().title}`)
        // console.log(doc.data())
      })
    })
  }, 5000)
})

const booksJoinQuery = `SELECT books.id,
books.title,
books.pubdate as publicationDate,
comments.text as summary,
authors.name as author,
identifiers.val as isbn,
books.last_modified as updated,
languages.lang_code as language,
series.name as series,
custom_column_5.value as source,
'http://biblioteca.hol.es/biblioteca/biblioteca/' || books.path || '/' || data.name || '.' || LOWER(data.format) as link
FROM books
JOIN comments ON books.id = comments.book
JOIN authors ON books.author_sort = authors.sort
JOIN identifiers ON books.id = identifiers.book
JOIN books_languages_link ON books.id = books_languages_link.book
JOIN languages ON books_languages_link.lang_code = languages.id
JOIN books_series_link ON books.id = books_series_link.book
JOIN series ON series.id = books_series_link.series
JOIN data ON books.id = data.book
JOIN books_custom_column_5_link ON books.id = books_custom_column_5_link.book
JOIN custom_column_5 ON custom_column_5.id = books_custom_column_5_link.value
--WHERE books.id = '1466'`
