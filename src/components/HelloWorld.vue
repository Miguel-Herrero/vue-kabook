<template>
  <div class="hello">
    <img src="../assets/logo.png" width="250px">
    <br>
    <br>
    <h1 class="title">Kabook</h1>
    <h3 class="subtitle">A little corner for your imagination</h3>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser || {}
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  text-align: center
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
