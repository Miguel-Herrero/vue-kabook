const state = {
  currentUser: null
}

const mutations = {
  SET_CURRENT_USER (state, { user }) {
    const { displayName, email, photoURL } = user
    state.currentUser = {
      displayName,
      email,
      photoURL
    }
  }
}

const actions = {
  fetchCurrentUser ({ commit, rootState }) {
    rootState.fb.auth().onAuthStateChanged((user) => {
      if (user) {
        commit('SET_CURRENT_USER', { user })
      }
    })
  }
}

export default { namespaced: true, state, mutations, actions }
