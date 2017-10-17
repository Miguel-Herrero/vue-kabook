<template>
  <div class="hero-head">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <router-link class="navbar-item" :to="{ name: 'Hello' }">
              <img src="../assets/kabook-logo.png" alt="Logo">
            </router-link>
            <span class="navbar-burger burger" data-target="navbarMenuHeroA">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroA" class="navbar-menu">
            <div class="navbar-end">
              <router-link class="navbar-item" :to="{ name: 'books' }">Books</router-link>
              <a class="navbar-item">
                Examples
              </a>
              <a class="navbar-item">
                Documentation
              </a>
              <span class="navbar-item" v-if="currentUser">
                <button @click="signOut" class="button is-primary">Log out</button>
              </span>
              <span class="navbar-item" v-else>
                <button @click="signInWithGoogle" class="button is-primary">Log in</button>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Header',

  methods: {
    signInWithGoogle () {
      this.$store.dispatch('users/signIn')
    },

    signOut () {
      this.$store.dispatch('users/signOut')
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser
    })
  }
}
</script>
