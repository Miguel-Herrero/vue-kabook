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
                <a class="button is-primary is-inverted">
                  <span class="icon">
                    <i class="fa fa-github"></i>
                  </span>
                  <span>Log out</span>
                </a>
              </span>
              <span class="navbar-item" v-else>
                <a class="button is-primary is-inverted">
                  <span class="icon">
                    <i class="fa fa-github"></i>
                  </span>
                  <span>Log in</span>
                </a>
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

  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser
    })
  }
}
</script>
