<template>
  <section class="section columns">
    <div class="column is-one-quarter">
      <figure class="image is-128x128">
        <img :src="cover">
      </figure>
    </div>
    <div class="column">
      <h1 class="title">{{ title }}</h1>
      <h2 class="subtitle">
        <router-link
          :to="{ name: 'authorDetail', params: { id: author.id } }"
          v-for="(author, index) in authors"
          :key="author.id">{{ author.fullName }} </router-link>
      </h2>
      <ul>
        <li><strong>ISBN</strong>: {{ isbn }}</li>
        <li><strong>Publication date</strong>: {{ publicationDate | moment("DD/MM/YYYY") }}</li>
        <li><strong>Source</strong>: {{ source }}</li>
        <li><strong>Language</strong>: {{ language }}</li>
        <li><strong>Tags</strong>:
          <div class="tags">
            <router-link
              :to="{ name: 'tagDetail', params: { id: tag.id } }"
              v-for="(tag, index) in tags"
              :key="index"
              class="tag">{{ tag.name }}
            </router-link>
          </div>
        </li>
        <li><strong>Summary</strong>: <p>{{ summary }}</p></li>
        <li><strong>Updated</strong>: {{ updated | moment("DD/MM/YYYY HH:mm") }}</li>
        <li><strong>Download</strong>:
          <a class="button is-uppercase"
            v-for="(link, index) in Object.keys(links)"
            :key="index"
            :href="links[link]">{{ link }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { booksRef, authorsRef, tagsRef } from '@/helpers/firebase'
export default {
  name: 'bookDetail',
  props: [ 'id' ],
  data () {
    return {
      authors: {},
      cover: 'http://via.placeholder.com/150x200',
      isbn: '',
      language: '',
      links: {},
      publicationDate: new Date(),
      source: '',
      summary: '',
      tags: {},
      title: '',
      updated: new Date()
    }
  },
  created () {
    booksRef.doc(this.id).get().then((doc) => {
      this.cover = doc.data().cover
      this.isbn = doc.data().isbn
      this.language = doc.data().language
      this.links = doc.data().links
      this.publicationDate = doc.data().publicationDate
      this.source = doc.data().source
      this.summary = doc.data().summary
      this.title = doc.data().title
      this.updated = doc.data().updated

      // Get authors from Firestore
      const authorsIds = Object.keys(doc.data().author) // TO-DO: Cambiar en DB author a plural
      authorsIds.forEach((authorId) => {
        authorsRef.doc(authorId).get().then((author) => {
          // Append this author key to authors data object
          this.$set(this.authors, authorId, {})
          // Append author's fullName to the key in this.authors
          this.$set(this.authors[authorId], 'fullName', author.data().fullName)
          this.$set(this.authors[authorId], 'id', author.id)
        })
      })

      // Get tags from Firestore
      const tagsIds = Object.keys(doc.data().tags)
      tagsIds.forEach((tagId) => {
        tagsRef.doc(tagId).get().then((tag) => {
          // Append this tag key to this.tags
          this.$set(this.tags, tagId, {})
          // Append tag info to its this.tags key
          this.$set(this.tags[tagId], 'name', tag.data().name)
          this.$set(this.tags[tagId], 'id', tag.id)
        })
      })
    })
  }
}
</script>
