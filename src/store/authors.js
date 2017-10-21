const state = {
  all: {},
  allIds: []
}

const mutations = {
  SET_AUTHOR (state, { author }) {
    const data = author.data()
    state.all = {
      ...state.all,
      [author.id]: { id: author.id, fullName: data.fullName }
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
    let author = await authorsRef.orderBy('fullName', 'asc').get()

    author.forEach(author => {
      commit('SET_AUTHOR', { author })
    })
  }
}

export default { namespaced: true, state, mutations, actions }
