<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <router-link class="navbar-item" :to="{ name: 'home' }" exact>
        <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
      </router-link>

      <a class="navbar-item is-hidden-desktop" href="https://github.com/jgthms/bulma" target="_blank">
        <span class="icon" style="color: #333;">
          <i class="fa fa-lg fa-github"></i>
        </span>
      </a>

      <a class="navbar-item is-hidden-desktop" href="https://twitter.com/jgthms" target="_blank">
        <span class="icon" style="color: #55acee;">
          <i class="fa fa-lg fa-twitter"></i>
        </span>
      </a>

      <div class="navbar-burger burger" data-target="navMenuTransparentExample">
        <span>Books</span>
        <span>Authors</span>
        <span>Tags</span>
      </div>
    </div>

    <div id="navMenuTransparentExample" class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item" :to="{ name: 'books' }">Books</router-link>
        <!-- <router-link class="navbar-item" :to="{ name: 'authors' }">Authors</router-link> -->
        <!-- <router-link class="navbar-item" :to="{ name: 'tags' }">Tags</router-link> -->
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <button v-if="!user" class="button is-primary" @click="signInWithGoogle">Log in</button>
              <button v-else class="button is-primary" @click="signOut">Log out</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import firebase from 'firebase'
import config from '@/../config'
export default {
  name: 'header',
  data () {
    return {
      user: null
    }
  },
  methods: {
    signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    signOut () {
      firebase.auth().signOut().then(() => {
        this.user = null
      }).catch(err => console.error(err))
    }
  },
  created () {
    const self = this
    // Set user if authenticated and authorized
    firebase.auth().onAuthStateChanged((user) => {
      if (user && config.dev.env.authEmails.includes(user.email)) {
        self.user = user
      }
    })
  }
}
</script>
