import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import {app,auth} from '@/config/firebaseConfig'
  
import VueTextareaAutosize from "vue-textarea-autosize";
Vue.use(VueTextareaAutosize);

import { VListItem } from 'vuetify/lib'

Vue.component('v-list-item', VListItem)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  created() {
    this.$store.dispatch('setFirebaseApp', app);
    this.$store.dispatch('setFirebaseAuth', auth);
  },
  render: h => h(App)
}).$mount('#app')