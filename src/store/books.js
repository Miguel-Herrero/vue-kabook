const state = {
  all: {},
  allIds: [],
  lastIds: []
}

const mutations = {
  SET_BOOK (state, { book }) {
    const data = book.data()
    state.all = {
      ...state.all,
      [book.id]: {
        isbn: book.id,
        title: data.title,
        authors: Object.keys(data.authors),
        cover: data.cover,
        source: data.source,
        publicationDate: data.publicationDate,
        language: data.language,
        summary: data.summary,
        updated: data.updated,
        links: data.links,
        tags: Object.keys(data.tags)
      }
    }
    if (state.allIds.indexOf(book.id) < 0) {
      // Only add to allIds array new fetched books
      state.allIds.push(book.id)
    }
  },

  SET_LAST_BOOK (state, { book }) {
    state.lastIds.push(book.id)
  }
}

const actions = {
  async getLastBooks ({ commit, rootState }) {
    let booksRef = rootState.db.collection('books')
    let books = await booksRef.orderBy('updated', 'desc').limit(5).get()

    books.forEach(book => {
      commit('SET_BOOK', { book })
      commit('SET_LAST_BOOK', { book })
    })
  },

  getBooks ({ commit, rootState }, options) {
    return new Promise((resolve, reject) => {
      if (!options) { return reject(new Error('No options for getting Books')) }
      const { orderBy, startAfter, limit } = options
      if (!orderBy || !startAfter || !limit) { return reject(new Error('No orderBy, startAFter or limit options for getting Books')) }

      let booksRef = rootState.db.collection('books')
      let booksQuery = booksRef.orderBy(orderBy).startAfter(startAfter).limit(limit).get()

      booksQuery.then(books => {
        if (!books.docs.length) { return reject(new Error('No more books')) }

        books.docs.forEach((book, index, array) => {
          if (book) { commit('SET_BOOK', { book }) }
          if (index === array.length - 1) { return resolve() }
        })
      })
    })
  },

  async getBooksByAuthor ({ commit, rootState }, authorId) {
    let booksRef = rootState.db.collection('books')
    let books = await booksRef.where('authors.' + authorId, '>', 0).get()

    console.log(books.length)

    books.forEach(book => {
      commit('SET_BOOK', { book })
    })
  },

  async getAllBooks ({ commit, rootState }) {
    let booksRef = rootState.db.collection('books')
    let books = await booksRef.get()

    books.forEach(book => {
      commit('SET_BOOK', { book })
    })
  },

  async getBooksByAuthora ({ commit, rootState }, { id }) {
    let booksRef = rootState.db.collection('books')
    let books = await booksRef.where('author.' + id, '>', 0).get()

    books.forEach(book => {
      commit('SET_BOOK', { book })
    })
  }
}

export default { namespaced: true, state, mutations, actions }
