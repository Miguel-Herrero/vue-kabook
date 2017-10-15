<template>
  <div id="app">
    <my-header></my-header>
    <router-view/>
    <my-footer></my-footer>
  </div>
</template>

<script>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import firebase from 'firebase'
export default {
  name: 'app',
  data () {
    return {
      user: null
    }
  },
  components: {
    myFooter: Footer,
    myHeader: Header
  },
  created () {
    const self = this
    // Set user if authenticated and authorized
    firebase.auth().onAuthStateChanged((user) => {
      self.user = user
    })
  }
}
</script>

<style lang="sass" src="bulma"></style>
