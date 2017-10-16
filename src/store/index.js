import Vue from 'vue'
import Vuex from 'vuex'

import 'babel-polyfill'

import Firebase from 'firebase'
import 'firebase/firestore'
import config from '../config'

import users from './users'

Firebase.initializeApp(config)

Vue.use(Vuex)

const state = {
  db: Firebase.firestore(),
  fb: Firebase
}

export default new Vuex.Store({
  state,
  modules: {
    users
  }
})
