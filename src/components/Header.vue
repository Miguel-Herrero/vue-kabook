<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <router-link class="navbar-item" :to="{ name: 'Hello' }">
        <img src="../assets/kabook-logo.png" alt="Logo">
      </router-link>

      <div class="navbar-burger burger" data-target="navMenuTransparent" v-on:click="showNav = !showNav" v-bind:class="{ 'is-active' : showNav }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div id="navMenuTransparent" class="navbar-menu" v-bind:class="{ 'is-active' : showNav }">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable" @click="showNav = false">
          <router-link class="navbar-item" :to="{ name: 'books' }">Books</router-link>
          <router-link class="navbar-item" :to="{ name: 'authors' }">Authors</router-link>
          <router-link class="navbar-item" :to="{ name: 'tags' }">Tags</router-link>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field is-grouped">
            <p class="control">
              <button v-if="currentUser" @click="signOut" class="button is-primary">Log out</button>
              <button v-else @click="signInWithGoogle" class="button is-primary">Log in</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Header',

  data () {
    return {
      showNav: false
    }
  },

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

<style scoped>
nav.navbar {
  margin-bottom: 20px;
}
</style>
