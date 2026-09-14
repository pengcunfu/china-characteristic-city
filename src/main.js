import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/reveal'
import { vTilt } from './directives/tilt'
import './animations/scroll'
import './styles/main.css'

const app = createApp(App)

app.directive('reveal', vReveal)
app.directive('tilt', vTilt)

app.use(router).mount('#app')
