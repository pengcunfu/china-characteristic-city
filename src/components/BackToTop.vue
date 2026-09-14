<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { onScroll, scrollToTop } from '../animations/scroll'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const visible = ref(false)
const ring = ref(null)
let stop = null

function update() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  visible.value = window.scrollY > 360
  if (ring.value) ring.value.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - ratio))
}

onMounted(() => {
  stop = onScroll(update)
  window.addEventListener('resize', update)
  update()
})

onUnmounted(() => {
  if (stop) stop()
  window.removeEventListener('resize', update)
})

function toTop() {
  scrollToTop(false)
}
</script>

<template>
  <button
    class="back-to-top"
    :class="{ 'is-visible': visible }"
    type="button"
    aria-label="回到顶部"
    @click="toTop"
  >
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle class="bt-track" cx="24" cy="24" :r="RADIUS" />
      <circle
        ref="ring"
        class="bt-ring"
        cx="24"
        cy="24"
        :r="RADIUS"
        :stroke-dasharray="CIRCUMFERENCE"
        stroke-dashoffset="0"
      />
    </svg>
    <span class="bt-arrow">↑</span>
  </button>
</template>
