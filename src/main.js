import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'  
import VueTextareaAutosize from "vue-textarea-autosize";
Vue.use(VueTextareaAutosize);

import { VListItem } from 'vuetify/lib'

Vue.component('v-list-item', VListItem)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')