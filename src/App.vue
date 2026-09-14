<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import BackToTop from './components/BackToTop.vue'
import { gsap, ScrollTrigger, prefersReducedMotion } from './animations/gsap'
import { scrollToTop } from './animations/scroll'

const route = useRoute()
const curtain = ref(null)

function onLeave(el, done) {
  if (prefersReducedMotion || !curtain.value) {
    done()
    return
  }
  const tl = gsap.timeline({ onComplete: done })
  tl.to(el, { opacity: 0, yPercent: -5, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' })
  tl.fromTo(
    curtain.value,
    { yPercent: -100 },
    { yPercent: 0, duration: 0.55, ease: 'power3.inOut' },
    0.1
  )
}

function onEnter(el, done) {
  scrollToTop(true)
  if (prefersReducedMotion || !curtain.value) {
    done()
    ScrollTrigger.refresh()
    return
  }
  gsap.set(el, { opacity: 0, yPercent: 5, filter: 'blur(10px)' })
  gsap
    .timeline({
      onComplete: () => {
        gsap.set(el, { clearProps: 'opacity,filter,transform' })
        ScrollTrigger.refresh()
        done()
      }
    })
    .to(curtain.value, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' })
    .to(
      el,
      { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
      0.12
    )
}
</script>

<template>
  <div class="site">
    <div class="ambient-bg" aria-hidden="true">
      <span class="ambient-orb ambient-orb-a"></span>
      <span class="ambient-orb ambient-orb-b"></span>
      <span class="ambient-orb ambient-orb-c"></span>
      <span class="ambient-grain"></span>
    </div>

    <ScrollProgress />
    <SiteHeader />

    <main class="site-main">
      <RouterView v-slot="{ Component }">
        <Transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <SiteFooter />
    <BackToTop />

    <div ref="curtain" class="page-curtain" aria-hidden="true">
      <span class="page-curtain-seal">城</span>
    </div>
  </div>
</template>
