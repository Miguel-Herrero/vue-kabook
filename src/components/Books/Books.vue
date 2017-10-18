<template>
  <section>
    <h1 class="title">All books</h1>
    <table class="table">
      <thead>
        <th>ISBN</th>
        <th>Title</th>
        <th>Author</th>
      </thead>
      <tbody>
        <tr v-for="id in booksIds" :key="id">
          <td><router-link :to="{ name: 'book', params: { id }}">{{ id }}</router-link></td>
          <td>{{ books[id].title }}</td>
          <td>{{ books[id].authors }}</td>
        </tr>
      </tbody>
    </table>
    <h1 class="title">Last books</h1>
    <ul>
      <li v-for="id in lastIds" :key="id">{{ books[id] }}</li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Books',

  computed: {
    ...mapState({
      books: state => state.books.all,
      booksIds: state => state.books.allIds,
      lastIds: state => state.books.lastIds
    })
  },

  created () {
    // Get last books if not already fetched
    if (!this.$store.state.books.lastIds.length) {
      this.$store.dispatch('books/getLastBooks')
    }

    this.$store.dispatch('books/getAllBooks')
  }
}
</script>
