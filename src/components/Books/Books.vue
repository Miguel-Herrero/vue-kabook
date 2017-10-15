<template>
  <section class="section">
    <section class="section">
      <div class="container">
        <h1 class="title">Last added</h1>
        <h2 class="subtitle">A short list of <strong>recently added</strong> books.</h2>
        <div class="columns is-multiline">
          <template v-for="book in books">
            <router-link class="column" :to="{ name: 'bookDetail', params: { id: book.id } }" :key="book.id">
              <book-card
                :id="book.id"
                :title="book.title"
                :author="Object.keys(book.author)[0]"
                :summary="book.summary"
                :updated="book.updated"
                :cover="book.cover">
              </book-card>
            </router-link>
          </template>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h1 class="title">Books list</h1>
        <h2 class="subtitle">A long list of all <strong>current books</strong> in library.</h2>
        <template v-for="book in 5">
            <router-link class="column" :to="{ name: 'bookDetail', params: { id: book.id }, props: { id: book.id } }" :key="book.id">
              <book-box></book-box>
            </router-link>
          </template>
      </div>
    </section>
  </section>
</template>

<script>
import BookCard from '@/components/Books/BookCard'
import BookBox from '@/components/Books/BookBox'
import { booksRef } from '@/helpers/firebase'
export default {
  name: 'books',
  data () {
    return {
      books: []
    }
  },
  components: {
    BookCard,
    BookBox
  },
  created () {
    booksRef.limit(4).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const book = {
          id: doc.data().isbn,
          title: doc.data().title,
          cover: doc.data().cover,
          author: doc.data().author,
          summary: doc.data().summary,
          updated: doc.data().updated
        }

        this.books.push(book)
      })
    })
  }
}
</script>
