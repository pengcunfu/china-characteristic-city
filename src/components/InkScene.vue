<script setup>
import { onMounted, onUnmounted, ref, useId } from 'vue'
import { gsap, motionEnabled, isTouch } from '../animations/gsap'

const props = defineProps({
  tone: { type: String, default: 'ember' },
  sun: { type: Boolean, default: true },
  birds: { type: Boolean, default: true },
  dust: { type: Boolean, default: true }
})

const uid = `ink-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

const root = ref(null)
const dustLayer = ref(null)
let ctx = null
let detach = []

onMounted(() => {
  const el = root.value
  if (!el) return

  if (props.dust && dustLayer.value && motionEnabled) {
    for (let i = 0; i < 18; i += 1) {
      const dot = document.createElement('span')
      dot.style.left = `${Math.random() * 100}%`
      dot.style.top = `${50 + Math.random() * 50}%`
      dot.style.setProperty('--size', `${1 + Math.random() * 3}px`)
      dot.style.setProperty('--dur', `${10 + Math.random() * 14}s`)
      dot.style.setProperty('--delay', `${-Math.random() * 20}s`)
      dot.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`)
      dot.style.setProperty('--alpha', `${0.2 + Math.random() * 0.5}`)
      dustLayer.value.appendChild(dot)
    }
  }

  if (!motionEnabled) return

  ctx = gsap.context(() => {
    const layers = Array.from(el.querySelectorAll('[data-depth]')).map((node) => ({
      node,
      depth: Number(node.dataset.depth) || 0,
      x: gsap.quickTo(node, 'x', { duration: 1.1, ease: 'power3.out' }),
      y: gsap.quickTo(node, 'y', { duration: 1.1, ease: 'power3.out' })
    }))

    layers.forEach((layer) => {
      if (!layer.depth) return
      gsap.to(layer.node, {
        yPercent: layer.depth * -0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      })
    })

    if (isTouch) return

    const state = { px: 0.5, py: 0.5, ticking: false }
    const apply = () => {
      state.ticking = false
      const nx = state.px - 0.5
      const ny = state.py - 0.5
      layers.forEach((layer) => {
        layer.x(-nx * layer.depth)
        layer.y(-ny * layer.depth * 0.6)
      })
    }
    const onMove = (event) => {
      state.px = event.clientX / window.innerWidth
      state.py = event.clientY / window.innerHeight
      if (!state.ticking) {
        state.ticking = true
        requestAnimationFrame(apply)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    detach.push(() => window.removeEventListener('pointermove', onMove))
  }, el)
})

onUnmounted(() => {
  detach.forEach((fn) => fn())
  detach = []
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="ink-scene" :class="`tone-${tone}`" aria-hidden="true">
    <span v-if="sun" class="ink-sun" data-depth="9"></span>

    <span class="ink-haze ink-haze-a" data-depth="14"></span>
    <span class="ink-haze ink-haze-b" data-depth="24"></span>

    <svg
      class="ink-ridge ridge-far"
      data-depth="10"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient :id="`${uid}-far`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--ink-far-a)" />
          <stop offset="100%" stop-color="var(--ink-far-b)" />
        </linearGradient>
      </defs>
      <path
        :fill="`url(#${uid}-far)`"
        d="M0 262 C 74 238 118 196 188 210 C 250 222 296 158 368 148 C 436 138 484 204 552 214 C 624 226 682 176 754 154 C 826 132 884 188 950 208 C 1022 230 1082 178 1152 162 C 1216 148 1288 206 1350 224 C 1392 236 1420 234 1440 228 L 1440 320 L 0 320 Z"
      />
    </svg>

    <svg
      class="ink-ridge ridge-mid"
      data-depth="18"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient :id="`${uid}-mid`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--ink-mid-a)" />
          <stop offset="100%" stop-color="var(--ink-mid-b)" />
        </linearGradient>
      </defs>
      <path
        :fill="`url(#${uid}-mid)`"
        d="M0 292 C 68 254 138 228 206 246 C 272 264 328 216 396 210 C 468 204 520 266 588 280 C 662 296 716 246 790 236 C 862 226 918 270 990 284 C 1060 298 1118 250 1188 242 C 1256 234 1320 270 1378 284 C 1408 291 1428 292 1440 290 L 1440 320 L 0 320 Z"
      />
    </svg>

    <svg
      class="ink-ridge ridge-near"
      data-depth="28"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient :id="`${uid}-near`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--ink-near-a)" />
          <stop offset="100%" stop-color="var(--ink-near-b)" />
        </linearGradient>
      </defs>
      <path
        :fill="`url(#${uid}-near)`"
        d="M0 320 L 0 306 C 88 298 168 284 248 292 C 328 300 400 314 480 308 C 566 300 638 280 728 288 C 818 296 882 314 968 310 C 1056 306 1124 288 1212 292 C 1290 296 1368 304 1440 302 L 1440 320 Z"
      />
    </svg>

    <svg v-if="birds" class="ink-birds" viewBox="0 0 220 80">
      <g class="ink-bird bird-a">
        <path d="M0 12 Q7 3 14 12 Q21 3 28 12" />
      </g>
      <g class="ink-bird bird-b">
        <path d="M0 9 Q5 2 10 9 Q15 2 20 9" />
      </g>
      <g class="ink-bird bird-c">
        <path d="M0 8 Q5 2 10 8 Q15 2 20 8" />
      </g>
    </svg>

    <div v-if="dust" ref="dustLayer" class="ink-dust"></div>
  </div>
</template>
