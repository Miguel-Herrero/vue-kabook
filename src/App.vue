<template>
  <section id="app" class="hero is-light is-bold is-fullheight">
    <!-- Hero head: will stick at the top -->
    <my-header />

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div class="container">
        <router-view/>
      </div>
    </div>
  </section>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'app',

  components: {
    myHeader: Header
  },

  created () {
    this.$store.dispatch('users/fetchCurrentUser')
  }
}
</script>

<style lang="sass" src="bulma"></style>
