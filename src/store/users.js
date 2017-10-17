import config from '@/config'

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
  },

  UNSET_CURRENT_USER (state) {
    state.currentUser = null
  }
}

const actions = {
  async fetchCurrentUser ({ commit, rootState }) {
    await rootState.fb.auth().onAuthStateChanged((user) => {
      if (user && config.authorizedEmails.includes(user.email)) {
        return commit('SET_CURRENT_USER', { user })
      } else if (user) {
        alert('Unauthorized user. Please use a valid Google account.')
        console.error('Unauthorized user')
      }
    })
  },

  async signIn ({ commit, rootState }) {
    const provider = new rootState.fb.auth.GoogleAuthProvider()
    await rootState.fb.auth().signInWithRedirect(provider)
  },

  async signOut ({ commit, rootState }) {
    await rootState.fb.auth().signOut().then(() => {
      commit('UNSET_CURRENT_USER')
    }).catch(err => console.error(err))
  }
}

export default { namespaced: true, state, mutations, actions }
