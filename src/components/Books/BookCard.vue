<template>
  <div class="card">
    <div class="card-image">
      <figure class="image is-1by1">
        <img :src="cover" :alt="imageAlt">
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ title }}</p>
          <p class="subtitle is-6">{{ author }}</p>
        </div>
      </div>

      <div class="content">
        {{ ellipsisSummary }}
        <br>
        <time datetime="2016-1-1">{{ updated | moment("DD-MM-YYYY") }}</time>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bookCard',
  props: [ 'title', 'cover', 'id', 'author', 'summary', 'updated' ],
  computed: {
    imageAlt () {
      return `${this.title} by ${this.author}`
    },
    ellipsisSummary () {
      return this.summary.substr(0, 200) + '\u2026'
    }
  }
}
</script>
