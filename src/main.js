import Vue from 'vue'
import VueFire from 'vuefire'
import App from './App'
import router from './router'
import VueMoment from 'vue-moment'
import './helpers/firebase'

Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(VueMoment)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
