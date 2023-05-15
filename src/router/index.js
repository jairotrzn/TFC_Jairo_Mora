import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/machines',
    name: 'machines',
    component: () => import('../views/Machines.vue')
  },
  {
    path: '/repuestos',
    name: 'repuestos',
    component: () => import('../views/Repuestos.vue')
  },
  {
    path: '/tareas',
    name: 'tareas',
    component: () => import('../views/Tareas')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
