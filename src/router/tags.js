import Books from '@/components/Books/Books'
import BookDetail from '@/components/Books/BookDetail'

export const routes = [
  {
    path: '/tags',
    name: 'tags',
    component: Books
  },
  {
    path: '/tags/:id',
    name: 'tagDetail',
    component: BookDetail,
    props: true
  }
]
