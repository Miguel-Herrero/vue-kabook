import Vue from 'vue'
import VueMoment from 'vue-moment'
import App from './App'
import router from '@/router'
import store from '@/store'

Vue.config.productionTip = false

Vue.use(VueMoment)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
