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
        id: book.id,
        title: data.title,
        authors: Object.keys(data.author),
        cover: data.cover,
        source: data.source,
        publicationDate: data.publicationDate,
        language: data.language,
        summary: data.summary,
        updated: data.updated,
        links: data.links,
        tags: data.tags
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

  async getAllBooks ({ commit, rootState }) {
    let booksRef = rootState.db.collection('books')
    let books = await booksRef.get()

    books.forEach(book => {
      commit('SET_BOOK', { book })
    })
  }
}

export default { namespaced: true, state, mutations, actions }
