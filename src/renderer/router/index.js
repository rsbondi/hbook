import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'read',
      component: require('@/components/Library').default
    },
    {
      path: '/read',
      name: 'read',
      component: require('@/components/Read').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
