<template>
  <section id="app" class="hero is-light is-bold is-fullheight">
    <!-- Hero head: will stick at the top -->
    <Header />

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div class="container">
        <img src="./assets/logo.png" width="250px">
        <router-view/>
      </div>
    </div>

    <!-- Hero footer: will stick at the bottom -->
    <Footer />
  </section>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: 'app',

  components: {
    Header,
    Footer
  },

  created () {
    this.$store.dispatch('users/fetchCurrentUser')
  }
}
</script>

<style lang="sass" src="bulma"></style>
