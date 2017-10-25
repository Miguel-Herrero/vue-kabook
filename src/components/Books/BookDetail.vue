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
          <router-link v-if="authorsAll[authorId].fullName" :to="{ name: 'author', params: { id: authorId } }">{{ authorsAll[authorId].fullName }}, </router-link>
        </span>
      </h3>

      <ul>
        <li><strong>Publication date</strong>: {{ books[id].publicationDate | moment("DD/MM/YYYY") }}</li>
        <li><strong>Source</strong>: {{ books[id].source }}</li>
        <li><strong>Language</strong>: {{ books[id].language }}</li>
        <li><strong>Tags</strong>:
          <div class="tags">
            <router-link
              v-for="tag in tags"
              :to="{ name: 'tag', params: { id: tag.id } }"
              :key="tag.id"
              class="tag">{{ tag.name }}
            </router-link>
          </div>
        </li>
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
      authorsAll: state => state.authors.all,
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
      if (!this.authorsAll[authorId]) {
        this.$store.dispatch('authors/fetchAuthor', { id: authorId })
      }
    })

    const tagsIds = this.books[this.id].tags
    tagsIds.forEach(tagId => {
      if (!this.tagsAllIds.length || !this.tagsAll[tagId]) {
        this.$store.dispatch('tags/fetchTag', { id: tagId })
      }
    })
  }
}
</script>
