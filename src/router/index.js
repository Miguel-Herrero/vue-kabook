import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
// import config from '@/../config'

/**
 * ROUTES
 */
import Home from '@/components/Home'
import Login from '@/components/Login'
import { routes as Books } from '@/router/books'
import { routes as Authors } from '@/router/authors'
import { routes as Tags } from '@/router/tags'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
  .concat(Books)
  .concat(Authors)
  .concat(Tags)
})

/**
 * AUTHENTICATION and AUTHORIZATION
 */
router.beforeResolve((to, from, next) => {
  // Only in exceptions check authorization
  return firebase.auth().onAuthStateChanged((user) => {
    if (!user && to.name !== 'login') {
      return next({name: 'login'})
    } else if (user && to.name === 'login') {
      return next({ name: 'home' })
    }

    return next()
    // if (user && config.dev.env.authEmails.includes(user.email)) {
    //   // If user is authenticated and authorized, continue
    //   return next()
    // } else if (user && to.name === 'login') {
    //   return next({ name: 'home' })
    // } else {
    //   return next({name: 'login'})
    // }
  })
})

export default router
