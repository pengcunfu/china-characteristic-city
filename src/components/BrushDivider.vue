<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap, prefersReducedMotion } from '../animations/gsap'

const root = ref(null)
let ctx = null

onMounted(() => {
  if (prefersReducedMotion || !root.value) return
  const path = root.value.querySelector('.brush-line')
  if (!path) return

  const length = path.getTotalLength()
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

  ctx = gsap.context(() => {
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: root.value, start: 'top 92%', once: true }
    })
    gsap.from(root.value.querySelector('.brush-dot'), {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: root.value, start: 'top 88%', once: true }
    })
  }, root.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="brush-divider" aria-hidden="true">
    <svg viewBox="0 0 1200 26" preserveAspectRatio="none">
      <path class="brush-line" d="M4 13 C 170 5, 330 22, 600 13 S 1030 5, 1196 13" />
    </svg>
    <span class="brush-dot"></span>
  </div>
</template>
