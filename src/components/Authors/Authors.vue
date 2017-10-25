<template>
  <section>
    <h1 class="title">All authors</h1>
    <table class="table">
      <thead>
        <th>Name</th>
      </thead>
      <tbody>
        <tr v-for="(author, index) in authors" :key="index">
          <td><router-link :to="{ name: 'author', params: { id: index }}">{{ author.fullName }}</router-link></td>
        </tr>
      </tbody>
    </table>

    <p>{{ authorsIds }}</p>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Authors',

  computed: {
    ...mapState({
      authors: state => state.authors.all,
      authorsIds: state => state.authors.allIds
    })
  },

  created () {
    if (!this.authorsIds.length) {
      this.$store.dispatch('authors/getAll')
    }
  }
}
</script>
