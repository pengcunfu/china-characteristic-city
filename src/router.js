import { createWebHistory } from 'vue-router'
import { createAppRouter } from './routes'

export default createAppRouter(createWebHistory(import.meta.env.BASE_URL))
