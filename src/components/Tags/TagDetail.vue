<template>
  <section>
    <h1 class="title">{{ tags[id].name }}</h1>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TagDetail',

  props: [ 'id' ],

  computed: {
    ...mapState({
      tags: state => state.tags.all
    })
  },

  created () {
    if (!this.tags[this.id]) {
      this.$store.dispatch('tags/fetchTag', { id: this.id })
    }
  }
}
</script>
