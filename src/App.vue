<template>
  <section id="app">
    <my-header />

    <div class="container">
      <router-view/>
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
<style scoped>
section#app {
  margin: 0 64px;
}
</style>
