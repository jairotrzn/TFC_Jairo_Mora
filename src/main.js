import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import { initializeApp } from 'firebase/app';
import { getFirestore,collection, getDocs,addDoc,doc,deleteDoc} from 'firebase/firestore';
  
import VueTextareaAutosize from "vue-textarea-autosize";
Vue.use(VueTextareaAutosize);

import { VListItem } from 'vuetify/lib'

Vue.component('v-list-item', VListItem)

const firebaseConfig = {
  apiKey: "AIzaSyCNc7UgKKvFKhFliYc5cwFN09QJeqTjj48",
  authDomain: "calendariomantenimiento-d401a.firebaseapp.com",
  projectId: "calendariomantenimiento-d401a",
  storageBucket: "calendariomantenimiento-d401a.appspot.com",
  messagingSenderId: "966712255259",
  appId: "1:966712255259:web:3baf9b6f4d3174f11669be"
};

const app = initializeApp(firebaseConfig);

 export const db = getFirestore(app);
 export {collection,getDocs,addDoc,doc,deleteDoc}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')