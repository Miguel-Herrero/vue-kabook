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
  },

  getTags ({ commit, rootState }, options) {
    return new Promise((resolve, reject) => {
      if (!options) { return reject(new Error('No options for getting Tags')) }
      const { orderBy, startAfter, limit } = options
      if (!orderBy || !startAfter || !limit) { return reject(new Error('No orderBy, startAFter or limit options for getting Tags')) }

      const tagsRef = rootState.db.collection('tags')
      const tagsQuery = tagsRef.orderBy(orderBy).startAfter(startAfter).limit(limit).get()

      tagsQuery.then(tags => {
        if (!tags.docs.length) { return reject(new Error('No more tags')) }

        tags.docs.forEach((tag, index, array) => {
          if (tag) { commit('SET_TAG', { tag }) }
          if (index === array.length - 1) { return resolve() }
        })
      })
    })
  }
}

export default { namespaced: true, state, mutations, actions }
