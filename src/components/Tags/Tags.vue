<template>
  <section>
    <h1 class="title">{{ $t('Tags.allTags') }}</h1>
    <table class="table">
      <thead>
        <th>{{ $t('Tags.tag.name') }}</th>
      </thead>
      <tbody>
        <tr v-for="(tag, index) in tags" :key="index">
          <td><router-link :to="{ name: 'tag', params: { id: index }}">{{ tag.name }}</router-link></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Tags',

  computed: {
    ...mapState({
      tags: state => state.tags.all,
      tagsIds: state => state.tags.allIds
    })
  },

  created () {
    this.$store.dispatch('tags/getAllTags')
  },

  i18n: {
    messages: {
      es: { Tags: {
        allTags: 'Todas las etiquetas',
        tag: {
          name: 'Nombre'
        }
      }},
      en: { Tags: {
        allTags: 'All tags',
        tag: {
          name: 'Name'
        }
      }}
    }
  }
}
</script>
