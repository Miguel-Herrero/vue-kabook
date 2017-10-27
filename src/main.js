import Vue from 'vue'
import VueMoment from 'vue-moment'
import App from './App'
import router from '@/router'
import store from '@/store'
import i18n from '@/i18n'

Vue.config.productionTip = false

Vue.use(VueMoment)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
