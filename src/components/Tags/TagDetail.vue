<template>
  <section>
    <h1 class="title">Books of {{ tags[id].name }}</h1>
    <table class="table">
      <thead>
        <th>ISBN</th>
        <th>Title</th>
      </thead>
      <tbody>
        <tr v-for="book in booksByTag" :key="book.title">
          <td><router-link :to="{ name: 'book', params: { id: book.id }}">{{ book.id }}</router-link></td>
          <td>{{ book.title }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TagDetail',

  props: [ 'id' ],

  computed: {
    ...mapState({
      tags: state => state.tags.all,
      books: state => state.books.all
    }),

    booksByTag () {
      const booksFiltered = []
      for (var id in this.books) {
        if (this.books[id].tags.includes(this.id)) {
          booksFiltered.push(this.books[id])
        }
      }
      return booksFiltered
    }
  },

  created () {
    if (!this.tags[this.id]) {
      this.$store.dispatch('tags/fetchTag', { id: this.id })
    }
  }
}
</script>
