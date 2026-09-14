import { revealIn } from '../animations/reveal'

export const vReveal = {
  mounted(el, binding) {
    el._revealTrigger = revealIn(el, binding.value || {})
  },
  unmounted(el) {
    if (el._revealTrigger) {
      el._revealTrigger.kill()
      el._revealTrigger = null
    }
  }
}
