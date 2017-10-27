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
  },

  i18n: {
    messages: {
      es: { Authors: {
        allAuthors: 'Todos los autores',
        author: {
          name: 'Nombre'
        }
      }},
      en: { Authors: {
        allAuthors: 'All authors',
        author: {
          name: 'Name'
        }
      }}
    }
  }
}
</script>
