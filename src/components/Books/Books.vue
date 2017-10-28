<template>
  <section>
    <h1 class="title">{{ $t('Books.allBooks') }}</h1>
    <table class="table">
      <thead>
        <th>{{ $t('Books.book.title') }}</th>
        <th>{{ $t('Books.book.author') }}</th>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.title">
          <td><router-link :to="{ name: 'book', params: { id: book.isbn }}">{{ book.title }}</router-link></td>
          <td>
            <span v-if="authors[authorId]" v-for="authorId in book.authors" :key="authorId">{{ authors[authorId].fullName }}</span>
            <span v-else>Loading author...</span>
          </td>
        </tr>
        <infinite-loading @infinite="infiniteHandler">
          <span slot="no-more">There are no more Books :(</span>
        </infinite-loading>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Books',

  computed: {
    ...mapState({
      books: state => state.books.all,
      booksIds: state => state.books.allIds,
      lastIds: state => state.books.lastIds,
      authors: state => state.authors.all
    })
  },

  methods: {
    infiniteHandler ($state) {
      this.$store.dispatch('books/getBooks', { startAfter: this.books[this.booksIds[this.booksIds.length - 1]], limit: 25 })
        .then(() => { $state.loaded() })
        // TO-DO: When no more results
    }
  },

  created () {
    // Get last books if not already fetched
    // if (!this.$store.state.books.lastIds.length) {
      // this.$store.dispatch('books/getLastBooks')
      // this.$store.dispatch('books/getBooks', { startAfter: this.booksIds.length, limit: 25 })
    // }
  },

  components: {
    InfiniteLoading
  },

  i18n: {
    messages: {
      es: { Books: {
        allBooks: 'Todos los libros',
        book: {
          title: 'Título',
          author: 'Autor'
        }
      }},
      en: { Books: {
        allBooks: 'All books',
        book: {
          title: 'Title',
          author: 'Author'
        }
      }}
    }
  }
}
</script>
