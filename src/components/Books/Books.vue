<template>
  <section>
    <h1 class="title">Last books</h1>
    <table class="table">
      <thead>
        <th>ISBN</th>
        <th>Title</th>
        <th>Author</th>
        <th>Added on</th>
      </thead>
      <tbody>
        <tr v-for="id in lastIds" :key="id">
          <th><router-link :to="{ name: 'book', params: { id: id }}">{{ id }}</router-link></th>
          <td>{{ books[id].title }}</td>
          <td>
            <span v-if="authors[authorId]" v-for="authorId in books[id].authors" :key="authorId">{{ authors[authorId].fullName }}</span>
            <span v-else>Loading author...</span>
          </td>
          <td>{{ books[id].updated | moment("DD/MM/YYYY") }}</td>
        </tr>
      </tbody>
    </table>

    <h1 class="title">All books</h1>
    <table class="table">
      <thead>
        <th>ISBN</th>
        <th>Title</th>
        <th>Author</th>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.title">
          <td><router-link :to="{ name: 'book', params: { id: book.isbn }}">{{ book.isbn }}</router-link></td>
          <td>{{ book.title }}</td>
          <td>
            <span v-if="authors[authorId]" v-for="authorId in book.authors" :key="authorId">{{ authors[authorId].fullName }}</span>
            <span v-else>Loading author...</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Books',

  data () {
    return {
      myBooks: {}
    }
  },

  computed: {
    ...mapState({
      books: state => state.books.all,
      booksIds: state => state.books.allIds,
      lastIds: state => state.books.lastIds,
      authors: state => state.authors.all,
      authorsIds: state => state.authors.allIds
    })
  },

  watch: {
    booksIds: function (val) {
      val.forEach(id => {
        this.books[id].authors.forEach(authorId => {
          if (this.authorsIds.indexOf(authorId) < 0) {
            this.$store.dispatch('authors/fetchAuthor', { id: authorId })
          }
        })
      })
    }
  },

  created () {
    // Get last books if not already fetched
    if (!this.$store.state.books.lastIds.length) {
      this.$store.dispatch('books/getLastBooks')
    }

    if (!this.booksIds.length) {
      this.$store.dispatch('books/getAllBooks')
    }
  }
}
</script>
