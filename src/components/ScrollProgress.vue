<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { onScroll } from '../animations/scroll'

const bar = ref(null)
let stop = null

function update() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
  if (bar.value) bar.value.style.transform = `scaleX(${ratio})`
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
</script>

<template>
  <div class="scroll-progress" aria-hidden="true">
    <span ref="bar"></span>
  </div>
</template>
