import { gsap, motionEnabled, isTouch } from '../animations/gsap'

const MAX_TILT = 7
const HOVER_LIFT = -6

export const vTilt = {
  mounted(el) {
    if (!motionEnabled || isTouch) return

    el.classList.add('tilt-card')
    el.style.transformPerspective = '1000px'

    const rotateX = gsap.quickTo(el, 'rotationX', { duration: 0.55, ease: 'power2.out' })
    const rotateY = gsap.quickTo(el, 'rotationY', { duration: 0.55, ease: 'power2.out' })
    const lift = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' })

    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height

      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)

      rotateY((px - 0.5) * MAX_TILT * 2)
      rotateX(-(py - 0.5) * MAX_TILT * 2)
      lift(HOVER_LIFT)
    }

    const onLeave = () => {
      rotateX(0)
      rotateY(0)
      lift(0)
      el.style.setProperty('--mx', '50%')
      el.style.setProperty('--my', '30%')
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)

    el._tiltCleanup = () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  },
  unmounted(el) {
    el._tiltCleanup?.()
    el.classList.remove('tilt-card')
  }
}
