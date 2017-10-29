const state = {
  all: {},
  allIds: []
}

const mutations = {
  SET_AUTHOR (state, { author }) {
    const data = author.data()
    state.all = {
      ...state.all,
      [author.id]: { id: author.id, fullName: data.fullName, lastName: data.lastName, name: data.name }
    }
    if (state.allIds.indexOf(author.id) < 0) {
      state.allIds.push(author.id)
    }
  }
}

const actions = {
  async fetchAuthor ({ commit, rootState }, { id }) {
    let authorsRef = rootState.db.collection('authors')
    let author = await authorsRef.doc(id).get()

    if (author) {
      commit('SET_AUTHOR', { author })
    }
  },

  async getAll ({ commit, rootState }) {
    let authorsRef = rootState.db.collection('authors')
    let authors = await authorsRef.orderBy('fullName', 'asc').get()

    authors.forEach(author => {
      commit('SET_AUTHOR', { author })
    })
  },

  getAuthors ({ commit, rootState }, options) {
    return new Promise((resolve, reject) => {
      if (!options) { return reject(new Error('No options for getting Authors')) }
      const { orderBy, startAfter, limit } = options
      if (!orderBy || !startAfter || !limit) { return reject(new Error('No orderBy, startAFter or limit options for getting Authors')) }

      const authorsRef = rootState.db.collection('authors')
      const authorsQuery = authorsRef.orderBy(orderBy).startAfter(startAfter).limit(limit).get()

      authorsQuery.then(authors => {
        if (!authors.docs.length) { return reject(new Error('No more authors')) }

        authors.docs.forEach((author, index, array) => {
          if (author) { commit('SET_AUTHOR', { author }) }
          if (index === array.length - 1) { return resolve() }
        })
      })
    })
  }
}

export default { namespaced: true, state, mutations, actions }
