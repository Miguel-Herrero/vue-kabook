import Books from '@/components/Books/Books'
import BookDetail from '@/components/Books/BookDetail'

export const routes = [
  {
    path: '/books',
    name: 'books',
    component: Books
  },
  {
    path: '/books/:id',
    name: 'bookDetail',
    component: BookDetail,
    props: true
  }
]
