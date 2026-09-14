import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ProvincesView from './views/ProvincesView.vue'
import ProvinceDetailView from './views/ProvinceDetailView.vue'
import NotFoundView from './views/NotFoundView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return false
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/provinces', name: 'provinces', component: ProvincesView },
    { path: '/province/:id', name: 'province', component: ProvinceDetailView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

export default router
