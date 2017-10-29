<template>
  <section class="section columns">
    <div class="column is-one-quarter">
      <figure class="image is-128x128">
        <img :src="books[id].cover">
      </figure>
    </div>

    <div class="column">
      <h1 class="title is-1">{{ books[id].title }}</h1>
      <h3 class="subtitle is-3">
        <span v-for="authorId in books[id].authors" :key="authorId">
          <router-link v-if="authors[authorId] && authors[authorId].fullName" :to="{ name: 'author', params: { id: authorId } }">{{ authors[authorId].fullName }}, </router-link>
        </span>
      </h3>

      <ul>
        <li><strong>{{ $t('BookDetail.book.publicationDate') }}</strong>: {{ books[id].publicationDate | moment("DD/MM/YYYY") }}</li>
        <li><strong>{{ $t('BookDetail.book.source') }}</strong>: {{ books[id].source }}</li>
        <li><strong>{{ $t('BookDetail.book.language') }}</strong>: {{ books[id].language }}</li>
        <li><strong>{{ $t('BookDetail.book.tags') }}</strong>:
          <div class="tags">
            <router-link
              v-for="tag in tags"
              :to="{ name: 'tag', params: { id: tag.id } }"
              :key="tag.id"
              class="tag">{{ tag.name }}
            </router-link>
          </div>
        </li>
        <li><strong>{{ $t('BookDetail.book.summary') }}</strong>: <p>{{ books[id].summary }}</p></li>
        <li><strong>{{ $t('BookDetail.book.updated') }}</strong>: {{ books[id].updated | moment("DD/MM/YYYY HH:mm") }}</li>
        <li><strong>{{ $t('BookDetail.book.download') }}</strong>:
          <a class="button is-uppercase"
            v-for="(link, index) in Object.keys(books[id].links)"
            :key="index"
            :href="books[id].links[link]">{{ link }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BookDetail',

  props: [ 'id' ],

  computed: {
    ...mapState({
      books: state => state.books.all,
      authors: state => state.authors.all,
      tagsAll: state => state.tags.all,
      tagsAllIds: state => state.tags.allIds
    }),

    tags () {
      const tagsIds = this.books[this.id].tags
      let tags = {}
      tagsIds.forEach(tagId => {
        if (this.tagsAll[tagId]) {
          tags = {
            ...tags,
            [tagId]: this.tagsAll[tagId]
          }
        }
      })
      return tags
    }
  },

  created () {
    this.books[this.id].authors.forEach(authorId => {
      if (!this.authors[authorId]) {
        this.$store.dispatch('authors/fetchAuthor', { id: authorId })
      }
    })

    const tagsIds = this.books[this.id].tags
    tagsIds.forEach(tagId => {
      if (!this.tagsAllIds.length || !this.tagsAll[tagId]) {
        this.$store.dispatch('tags/fetchTag', { id: tagId })
      }
    })
  },

  i18n: {
    messages: {
      es: { BookDetail: {
        book: {
          publicationDate: 'Fecha de publicación',
          source: 'Fuente',
          language: 'Idioma',
          tags: 'Etiquetas',
          summary: 'Resumen',
          updated: 'Actualizado',
          download: 'Descargas'
        }
      }},
      en: { Books: {
        book: {
          publicationDate: 'Publication date',
          source: 'Source',
          language: 'Language',
          tags: 'Tags',
          summary: 'Summary',
          updated: 'Updated',
          download: 'Downloads'
        }
      }}
    }
  }
}
</script>
