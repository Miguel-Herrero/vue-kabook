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
  name: 'Tags',

  components: {
    InfiniteLoading
  },

  computed: {
    ...mapState({
      tags: state => state.tags.all,
      tagsIds: state => state.tags.allIds
    })
  },

  i18n: {
    messages: {
      es: { Tags: {
        allTags: 'Todas las etiquetas',
        noMoreResults: 'No hay más resultados',
        tag: {
          name: 'Nombre'
        }
      }},
      en: { Tags: {
        allTags: 'All tags',
        noMoreResults: 'There are no more results',
        tag: {
          name: 'Name'
        }
      }}
    }
  },

  methods: {
    infiniteHandler ($state) {
      this.$store.dispatch('tags/getTags', {
        orderBy: 'name',
        startAfter: (this.tags[this.tagsIds[this.tagsIds.length - 1]] && this.tags[this.tagsIds[this.tagsIds.length - 1]].name) || '0',
        limit: 10
      })
        .then(() => $state.loaded())
        .catch(() => $state.complete())
    }
  }
}
</script>
