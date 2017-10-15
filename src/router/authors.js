import Authors from '@/components/Authors/Authors'
import AuthorsList from '@/components/Authors/AuthorsList'
import AuthorsDetails from '@/components/Authors/AuthorsDetails'

export const routes = [
  {
    path: '/authors',
    component: Authors,
    children: [
      {
        path: '',
        name: 'authors',
        component: AuthorsList
      },
      {
        path: ':id',
        name: 'authorsDetails',
        component: AuthorsDetails
      }
    ]
  }
]
