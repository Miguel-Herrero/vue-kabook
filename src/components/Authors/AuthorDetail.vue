<template>
  <section>
    <h1 class="title">{{ $t('AuthorDetail.booksBy') }} {{ authors[id].fullName }}</h1>
    <table class="table">
      <thead>
        <th>{{ $t('AuthorDetail.book.isbn') }}</th>
        <th>{{ $t('AuthorDetail.book.title') }}</th>
      </thead>
      <tbody>
        <tr v-for="book in booksByAuthor" :key="book.title">
          <td><router-link :to="{ name: 'book', params: { id: book.isbn }}">{{ book.isbn }}</router-link></td>
          <td><router-link :to="{ name: 'book', params: { id: book.isbn }}">{{ book.title }}</router-link></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AuthorDetail',

  props: [ 'id' ],

  computed: {
    ...mapState({
      authors: state => state.authors.all,
      books: state => state.books.all
    }),

    booksByAuthor () {
      const booksFiltered = []
      for (var id in this.books) {
        if (this.books[id].authors.includes(this.id)) {
          booksFiltered.push(this.books[id])
        }
      }
      return booksFiltered
    }
  },

  created () {
    if (!this.authors[this.id]) {
      this.$store.dispatch('authors/fetchAuthor', { id: this.id })
    }

    this.$store.dispatch('books/getBooksByAuthor', this.id)
  },

  i18n: {
    messages: {
      es: { AuthorDetail: {
        booksBy: 'Libros de',
        book: {
          title: 'Título',
          isbn: 'ISBN'
        }
      }},
      en: { AuthorDetail: {
        booksBy: 'Books by',
        book: {
          title: 'Title',
          isbn: 'ISBN'
        }
      }}
    }
  }
}
</script>
