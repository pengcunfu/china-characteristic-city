import { gsap, motionEnabled, isTouch } from '../animations/gsap'

/**
 * 指针视差：让卡片内的 [data-depth] 图层跟随鼠标轻微移动，
 * 同时把指针位置写入 --mx / --my，供光斑、渐变等装饰使用。
 */
export const vParallax = {
  mounted(el, binding) {
    if (!motionEnabled || isTouch) return

    const strength = Number(binding.value?.strength) || 18
    const nodes = Array.from(el.querySelectorAll('[data-depth]'))

    const layers = nodes.map((node) => ({
      depth: Number(node.dataset.depth) || 0,
      x: gsap.quickTo(node, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(node, 'y', { duration: 0.8, ease: 'power3.out' })
    }))

    const state = { nx: 0, ny: 0, ticking: false }

    const apply = () => {
      state.ticking = false
      layers.forEach((layer) => {
        layer.x(-state.nx * layer.depth * strength * 0.06)
        layer.y(-state.ny * layer.depth * strength * 0.04)
      })
    }

    const onMove = (event) => {
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      state.nx = (event.clientX - rect.left) / rect.width - 0.5
      state.ny = (event.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--mx', `${(state.nx + 0.5) * 100}%`)
      el.style.setProperty('--my', `${(state.ny + 0.5) * 100}%`)
      if (!state.ticking) {
        state.ticking = true
        requestAnimationFrame(apply)
      }
    }

    const onLeave = () => {
      state.nx = 0
      state.ny = 0
      apply()
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)

    el._parallaxCleanup = () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(nodes)
    }
  },
  unmounted(el) {
    el._parallaxCleanup?.()
  }
}
