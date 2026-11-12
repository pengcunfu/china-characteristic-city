import { createSSRApp } from 'vue'
import { createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import { App, installApp } from './app'
import { createAppRouter } from './routes'

export { provinces } from './data/store'
export {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  OG_IMAGE,
  OG_IMAGE_ALT,
  getPageSeo
} from './lib/seo'

export const buildDate = new Date().toISOString().slice(0, 10)

export async function render(path) {
  const router = createAppRouter(createMemoryHistory())
  const app = installApp(createSSRApp(App))

  app.use(router)
  await router.push(path)
  await router.isReady()

  const html = await renderToString(app)
  return { html }
}
