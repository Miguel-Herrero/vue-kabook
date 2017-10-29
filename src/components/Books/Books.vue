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
          <span slot="no-more">{{ $t('Tags.noMoreResults') }}</span>
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

  components: {
    InfiniteLoading
  },

  computed: {
    ...mapState({
      books: state => state.books.all,
      booksIds: state => state.books.allIds,
      lastIds: state => state.books.lastIds,
      authors: state => state.authors.all
    })
  },

  i18n: {
    messages: {
      es: { Books: {
        allBooks: 'Todos los libros',
        noMoreResults: 'No hay más resultados',
        book: {
          title: 'Título',
          author: 'Autor'
        }
      }},
      en: { Books: {
        allBooks: 'All books',
        noMoreResults: 'There are no more results',
        book: {
          title: 'Title',
          author: 'Author'
        }
      }}
    }
  },

  methods: {
    infiniteHandler ($state) {
      this.$store.dispatch('books/getBooks', {
        orderBy: 'title',
        startAfter: (this.books[this.booksIds[this.booksIds.length - 1]] && this.books[this.booksIds[this.booksIds.length - 1]].title) || '0',
        limit: 10
      })
        .then(() => $state.loaded())
        .catch(() => $state.complete())
    }
  }
}
</script>
