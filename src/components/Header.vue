<template>
  <nav class="navbar is-transparent">
    <div class="navbar-brand">
      <router-link class="navbar-item" :to="{ name: 'Hello' }">
        <img src="../assets/kabook-logo.png" alt="Logo">
      </router-link>

      <div class="navbar-burger burger" data-target="navMenuTransparentExample">
        <router-link class="navbar-item" :to="{ name: 'books' }">Books</router-link>
      </div>
    </div>

    <div id="navMenuTransparentExample" class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <router-link class="navbar-item" :to="{ name: 'books' }">Books</router-link>
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
  margin-bottom: 50px;
}
</style>
