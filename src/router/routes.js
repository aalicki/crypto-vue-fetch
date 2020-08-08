// single pages
import homePage from '../pages/Home.vue'
import coinDetailPage from '../pages/CoinDetails'
import notFoundPage from '../pages/NotFound.vue'

// import { routePropResolver } from './util'
import { DOMAIN_TITLE } from '../.env'

export const routes = [
  {
    path: '/',
    name: 'index',
    component: homePage,
    meta: { title: `${DOMAIN_TITLE} | home` }
  },
  {
    path: '/coin-details/:symbol',
    name: 'coin-details',
    component: coinDetailPage,
    meta: { title: `${DOMAIN_TITLE} | coin details` }
  },
  {
    path: '*',
    component: notFoundPage,
    meta: { title: `${DOMAIN_TITLE} | not found` }
  }
]
