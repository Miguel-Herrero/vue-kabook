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
        <span v-for="author in authors" :key="author.id">
          <router-link :to="{ name: 'authorDetail', params: { id: author.id } }">{{ author.fullName }}, </router-link>
        </span>
      </h3>

      <ul>
         <li><strong>Publication date</strong>: {{ books[id].publicationDate | moment("DD/MM/YYYY") }}</li>
        <li><strong>Source</strong>: {{ books[id].source }}</li>
        <li><strong>Language</strong>: {{ books[id].language }}</li>
        <li><strong>Summary</strong>: <p>{{ books[id].summary }}</p></li>
        <li><strong>Updated</strong>: {{ books[id].updated | moment("DD/MM/YYYY HH:mm") }}</li>
        <li><strong>Download</strong>:
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
  name: 'bookDetail',

  props: [ 'id' ],

  computed: {
    ...mapState({
      books: state => state.books.all,
      authorsAll: state => state.authors.all
    }),

    authors () {
      const bookAuthorsIds = Object.keys(this.books[this.id].authors)
      let authors = {}
      bookAuthorsIds.forEach(authorId => {
        if (this.authorsAll[authorId]) {
          authors = {
            ...authors,
            [authorId]: this.authorsAll[authorId]
          }
        }
      })
      return authors
    }
  },

  created () {
    const bookAuthorsIds = Object.keys(this.books[this.id].authors)
    bookAuthorsIds.forEach(authorId => {
      this.$store.dispatch('authors/fetchAuthor', { id: authorId })
    })
  }
}
</script>
