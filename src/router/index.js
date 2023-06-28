import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import { auth } from '@/config/firebaseConfig';

Vue.use(VueRouter);



const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login')
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/machines',
    name: 'machines',
    component: () => import('../views/Machines.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/repuestos',
    name: 'repuestos',
    component: () => import('../views/Repuestos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tareas',
    name: 'tareas',
    component: () => import('../views/Tareas'),
    meta: { requiresAuth: true }
  },
  {
    path: '/preventivos',
    name: 'preventivos',
    component: () => import('../views/Preventivos'),
    meta: { requiresAuth: true }
  },  
  {
    path: '/averias',
    name: 'prevaveriasentivos',
    component: () => import('../views/Averias'),
    meta: { requiresAuth: true }
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
 
router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router;
