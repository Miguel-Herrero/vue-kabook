import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Books from '@/components/Books/Books'
import BookDetail from '@/components/Books/BookDetail'
import Tags from '@/components/Tags/Tags'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/books',
      name: 'books',
      component: Books
    },
    {
      path: '/books/:id',
      name: 'book',
      component: BookDetail,
      props: true
    },
    {
      path: '/tags',
      name: 'tags',
      component: Tags
    }
  ]
})

router.beforeResolve((to, from, next) => {
  const user = store.state.users.currentUser
  if (!user && to.name !== 'Hello') {
    console.warn('Unauthorized route for unauthenticated user. Redirecting to home…')
    return next({name: 'Hello'})
  // } else if (user && to.name === 'books') {
  //   console.log('user a Books')
  //   return next({ name: 'Hello' })
  } else {
    return next()
  }
})

export default router
