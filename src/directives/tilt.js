import { motionEnabled, isTouch } from '../animations/gsap'

export const vTilt = {
  mounted(el, binding) {
    if (!motionEnabled || isTouch) return

    el.classList.add('tilt-card')
  },
  unmounted(el) {
    el.classList.remove('tilt-card')
  }
}
