import { createRouter } from 'vue-router'

const HomeView = () => import('./views/HomeView.vue')
const ProvincesView = () => import('./views/ProvincesView.vue')
const ProvinceDetailView = () => import('./views/ProvinceDetailView.vue')
const CityDetailView = () => import('./views/CityDetailView.vue')
const NotFoundView = () => import('./views/NotFoundView.vue')

export const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/provinces', name: 'provinces', component: ProvincesView },
  { path: '/province/:id', name: 'province', component: ProvinceDetailView },
  { path: '/city/:id/:city', name: 'city', component: CityDetailView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
]

export function createAppRouter(history) {
  return createRouter({
    history,
    routes,
    scrollBehavior() {
      return false
    }
  })
}
