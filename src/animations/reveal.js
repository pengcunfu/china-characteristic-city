import { gsap, prefersReducedMotion } from './gsap'

const TRANSFORM_KEYS = ['x', 'y', 'yPercent', 'scale', 'rotateX', 'rotateY']

export function revealIn(el, options = {}) {
  if (!el || prefersReducedMotion) return null

  const {
    opacity = 0,
    blur = 0,
    duration = 0.9,
    delay = 0,
    ease = 'power3.out',
    start = 'top 88%'
  } = options

  const from = {}
  const to = {}
  for (const key of TRANSFORM_KEYS) {
    if (options[key] !== undefined) {
      from[key] = options[key]
      to[key] = key === 'scale' ? 1 : 0
    }
  }
  if (!Object.keys(from).length) {
    from.y = 40
    to.y = 0
  }

  from.opacity = opacity
  from.transformPerspective = 900
  to.opacity = 1
  to.duration = duration
  to.delay = delay
  to.ease = ease
  to.overwrite = 'auto'

  if (blur) {
    from.filter = `blur(${blur}px)`
    to.filter = 'blur(0px)'
  }

  gsap.set(el, from)
  return gsap.to(el, { ...to, scrollTrigger: { trigger: el, start, once: true } }).scrollTrigger
}

export function countUp(el, target, options = {}) {
  if (!el) return null

  const value = Number(target) || 0
  const duration = options.duration ?? 1.5
  const start = options.start ?? 'top 90%'

  if (prefersReducedMotion) {
    el.textContent = format(value)
    return null
  }

  const state = { value: 0 }
  return gsap.to(state, {
    value,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = format(state.value)
    },
    scrollTrigger: { trigger: el, start, once: true }
  })
}

function format(value) {
  return Math.round(value).toLocaleString('en-US')
}
