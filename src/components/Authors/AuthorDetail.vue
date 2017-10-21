<template>
  <section>
    <h1 class="title">{{ authors[id].fullName }}</h1>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AuthorDetail',

  props: [ 'id' ],

  computed: {
    ...mapState({
      authors: state => state.authors.all
    })
  },

  created () {
    if (!this.authors[this.id]) {
      this.$store.dispatch('authors/fetchAuthor', { id: this.id })
    }
  }
}
</script>
