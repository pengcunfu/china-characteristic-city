<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, prefersReducedMotion } from '../animations/gsap'

const root = ref(null)
let ctx = null

onMounted(() => {
  if (prefersReducedMotion || !root.value) return

  const el = root.value
  ctx = gsap.context((self) => {
    const q = gsap.utils.selector(el)
    const heading = el.querySelector('.not-found h1')
    const float = heading
      ? gsap.to(heading, {
          y: -10,
          duration: 2.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          paused: true
        })
      : null

    const tl = gsap.timeline({ delay: 0.1 })
    if (heading) {
      tl.from(heading, {
        y: 34,
        opacity: 0,
        scale: 0.82,
        filter: 'blur(14px)',
        duration: 0.8,
        ease: 'back.out(1.6)'
      })
    }
    tl.from(q('.not-found p'), { y: 16, opacity: 0, duration: 0.5 }, '-=0.35')
    tl.from(q('.not-found .btn'), { y: 16, opacity: 0, duration: 0.5 }, '-=0.3')
    tl.eventCallback('onComplete', () => {
      if (float) float.play()
    })
  }, el)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="container">
    <div class="not-found">
      <h1>404</h1>
      <p>你访问的页面不存在。</p>
      <RouterLink to="/" class="btn">回到首页</RouterLink>
    </div>
  </div>
</template>
