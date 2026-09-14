import Lenis from 'lenis'
import { gsap, ScrollTrigger, motionEnabled, isTouch } from './gsap'

let lenis = null

if (motionEnabled && !isTouch) {
  lenis = new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function scrollToTop(immediate = true) {
  if (lenis) {
    lenis.scrollTo(0, { immediate })
    return
  }
  window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export function onScroll(callback) {
  if (lenis) {
    lenis.on('scroll', callback)
    return () => lenis.off('scroll', callback)
  }
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

export { lenis }
