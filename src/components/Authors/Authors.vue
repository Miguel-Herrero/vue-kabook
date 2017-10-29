<template>
  <section>
    <h1 class="title">{{ $t('Authors.allAuthors') }}</h1>
    <table class="table">
      <thead>
        <th>{{ $t('Authors.author.name') }}</th>
      </thead>
      <tbody>
        <tr v-for="(author, index) in authors" :key="index">
          <td><router-link :to="{ name: 'author', params: { id: index }}">{{ author.fullName }}</router-link></td>
        </tr>
        <infinite-loading @infinite="infiniteHandler">
          <span slot="no-more">{{ $t('Authors.noMoreResults') }}</span>
        </infinite-loading>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Authors',

  components: {
    InfiniteLoading
  },

  computed: {
    ...mapState({
      authors: state => state.authors.all,
      authorsIds: state => state.authors.allIds
    })
  },

  i18n: {
    messages: {
      es: { Authors: {
        allAuthors: 'Todos los autores',
        noMoreResults: 'No hay más resultados',
        author: {
          name: 'Nombre'
        }
      }},
      en: { Authors: {
        allAuthors: 'All authors',
        noMoreResults: 'There are no more results',
        author: {
          name: 'Name'
        }
      }}
    }
  },

  methods: {
    infiniteHandler ($state) {
      this.$store.dispatch('authors/getAuthors', {
        orderBy: 'lastName',
        startAfter: (this.authors[this.authorsIds[this.authorsIds.length - 1]] && this.authors[this.authorsIds[this.authorsIds.length - 1]].lastName) || '0',
        limit: 10
      })
        .then(() => $state.loaded())
        .catch(() => $state.complete())
    }
  },

  created () {
    this.$store.dispatch('authors/getAuthors', {
      orderBy: 'lastName',
      startAfter: '0',
      limit: 1
    })
  }
}
</script>
