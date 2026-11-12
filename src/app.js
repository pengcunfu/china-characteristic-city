import App from './App.vue'
import { vReveal } from './directives/reveal'
import { vTilt } from './directives/tilt'
import { vParallax } from './directives/parallax'

export function installApp(app) {
  app.directive('reveal', vReveal)
  app.directive('tilt', vTilt)
  app.directive('parallax', vParallax)
  return app
}

export { App }
