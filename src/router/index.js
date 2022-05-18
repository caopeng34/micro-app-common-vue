import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/ceshi1"
  },
  {
    path: '/ceshi1',
    name: 'ceshi1',
    component: () => import(/* webpackChunkName: "about" */ '../views/ceshi1.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
