import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

const hasWindow = typeof window !== 'undefined'

export const prefersReducedMotion = hasWindow
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

export const isTouch = hasWindow
  ? window.matchMedia('(hover: none) and (pointer: coarse)').matches
  : false

export const motionEnabled = hasWindow && !prefersReducedMotion

gsap.defaults({ ease: 'power3.out', duration: 0.8 })

export { gsap, ScrollTrigger, Flip }
