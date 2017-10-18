import Vue from 'vue'
import Vuex from 'vuex'

import 'babel-polyfill'

import Firebase from 'firebase'
import 'firebase/firestore'
import config from '@/config'

import authors from '@/store/authors'
import users from '@/store/users'
import books from '@/store/books'

Firebase.initializeApp(config)

Vue.use(Vuex)

const state = {
  db: Firebase.firestore(),
  fb: Firebase
}

export default new Vuex.Store({
  state,
  modules: {
    authors,
    users,
    books
  }
})
