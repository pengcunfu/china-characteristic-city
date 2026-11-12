import { createApp, createSSRApp } from 'vue'
import { App, installApp } from './app'
import router from './router'
import './animations/scroll'
import './styles/main.css'
import './styles/enhance.css'
import { applySeo, getPageSeo } from './lib/seo'

// 兼容旧的 hash 链接（如 /#/province/江苏），转到干净的静态路径
if (window.location.hash.startsWith('#/')) {
  const target = window.location.hash.slice(1) || '/'
  window.location.replace(`${target}${window.location.search}`)
}

const container = document.querySelector('#app')
const hasServerHtml = import.meta.env.PROD && container && container.hasChildNodes()
const app = installApp(hasServerHtml ? createSSRApp(App) : createApp(App))

app.use(router)

router.afterEach((to) => {
  applySeo(getPageSeo(to.fullPath))
})

router.isReady().then(() => {
  applySeo(getPageSeo(router.currentRoute.value.fullPath))
  app.mount('#app')
})
