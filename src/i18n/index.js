import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './messages'

Vue.use(VueI18n)

const browserLanguage = navigator.language.split('-')[0]

const i18n = new VueI18n({
  locale: browserLanguage || 'es',
  messages: messages,
  fallbackLocale: 'es'
})

export default i18n
