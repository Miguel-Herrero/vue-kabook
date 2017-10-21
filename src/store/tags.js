const state = {
  all: {},
  allIds: []
}

const mutations = {
  SET_TAG (state, { tag }) {
    const data = tag.data()
    state.all = {
      ...state.all,
      [tag.id]: { id: tag.id, name: data.name }
    }
    if (state.allIds.indexOf(tag.id) < 0) {
      state.allIds.push(tag.id)
    }
  }
}

const actions = {
  async fetchTag ({ commit, rootState }, { id }) {
    let tagsRef = rootState.db.collection('tags')
    let tag = await tagsRef.doc(id).get()

    if (tag) {
      commit('SET_TAG', { tag })
    }
  },

  async getAllTags ({ commit, rootState }) {
    let tagsRef = rootState.db.collection('tags')
    let tags = await tagsRef.orderBy('name', 'asc').get()

    tags.forEach(tag => {
      commit('SET_TAG', { tag })
    })
  }
}

export default { namespaced: true, state, mutations, actions }
