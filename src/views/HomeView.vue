<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBox from '../components/SearchBox.vue'
import ProvinceCard from '../components/ProvinceCard.vue'
import { REGIONS } from '../data/regions'
import { totalProvinces, totalCities, featuredProvinces, cityTicker } from '../data/store'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { splitChars } from '../animations/splitChars'
import { countUp } from '../animations/reveal'

const router = useRouter()
const query = ref('')
const featured = featuredProvinces(12)
const ticker = cityTicker(48)

const root = ref(null)
let ctx = null
let split = null

function onSearch(q) {
  router.push({ path: '/provinces', query: q ? { q } : {} })
}

onMounted(() => {
  if (prefersReducedMotion || !root.value) return

  const el = root.value
  ctx = gsap.context(() => {
    const q = gsap.utils.selector(el)
    const title = el.querySelector('.hero-title')
    if (title) split = splitChars(title)

    const tl = gsap.timeline({ delay: 0.12 })
    tl.from(q('.hero-eyebrow'), { y: 22, opacity: 0, duration: 0.7 })
    if (split) {
      tl.from(
        split.chars,
        {
          yPercent: 72,
          opacity: 0,
          rotateX: -88,
          transformPerspective: 620,
          transformOrigin: '50% 100%',
          stagger: 0.045,
          duration: 0.85
        },
        '-=0.4'
      )
    }
    tl.from(q('.hero-sub'), { y: 20, opacity: 0, duration: 0.7 }, '-=0.6')
    tl.from(q('.hero-search'), { y: 24, opacity: 0, scale: 0.96, duration: 0.7 }, '-=0.52')
    tl.from(q('.hero-stat'), { y: 22, opacity: 0, stagger: 0.09, duration: 0.6 }, '-=0.45')
    tl.from(q('.hero-cue'), { opacity: 0, duration: 0.6 }, '-=0.2')

    gsap.to(q('.hero-mountains'), {
      yPercent: 16,
      ease: 'none',
      scrollTrigger: { trigger: q('.hero'), start: 'top top', end: 'bottom top', scrub: true }
    })

    q('.hero-stat-num').forEach((node) => countUp(node, Number(node.dataset.count)))
  }, el)
})

onUnmounted(() => {
  ctx?.revert()
  split?.revert()
  split = null
})
</script>

<template>
  <div ref="root">
    <section class="hero">
      <div class="container hero-inner">
        <p class="hero-eyebrow">一方水土 · 一方风情</p>
        <h1 class="hero-title">中国<span class="accent">特色城市</span></h1>
        <p class="hero-sub">
          从北国冰城到南国花城，从江南水乡到雪域高原。走进每一座城市，
          读懂它的特色、饮食、文化与烟火日常。
        </p>

        <div class="hero-search">
          <SearchBox v-model="query" placeholder="试试搜索「苏州」或「火锅」…" @submit="onSearch" />
        </div>

        <div class="hero-stats">
          <div class="hero-stat">
            <strong class="hero-stat-num" :data-count="totalProvinces">{{ totalProvinces }}</strong>
            <span>个省份</span>
          </div>
          <div class="hero-stat">
            <strong class="hero-stat-num" :data-count="totalCities">{{ totalCities }}</strong>
            <span>座城市</span>
          </div>
          <div class="hero-stat">
            <strong class="hero-stat-num" :data-count="REGIONS.length">{{ REGIONS.length }}</strong>
            <span>大地理分区</span>
          </div>
        </div>

        <div class="hero-cue" aria-hidden="true"><span></span></div>
      </div>

      <svg class="hero-mountains" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 180 L180 70 L320 150 L480 40 L640 150 L820 80 L980 160 L1160 60 L1320 150 L1440 110 L1440 180 Z"
          fill="rgba(247,242,232,0.10)"
        />
        <path
          d="M0 180 L240 110 L420 170 L620 95 L840 175 L1040 120 L1240 175 L1440 140 L1440 180 Z"
          fill="rgba(247,242,232,0.16)"
        />
      </svg>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">特色省份精选</h2>
            <p class="section-sub">从直辖市到文化大省，先认识这些最具代表性的地方</p>
          </div>
          <RouterLink to="/provinces" class="section-more">全部省份 →</RouterLink>
        </div>
        <div class="grid">
          <ProvinceCard
            v-for="(p, i) in featured"
            :key="p.id"
            v-reveal="{ yPercent: 12, scale: 0.97, delay: (i % 6) * 0.06 }"
            :province="p"
          />
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">按地理分区浏览</h2>
            <p class="section-sub">华北、东北、华东……每个分区都有自己的气质</p>
          </div>
        </div>
        <div class="region-grid">
          <RouterLink
            v-for="(r, i) in REGIONS"
            :key="r.name"
            v-reveal="{ yPercent: 14, scale: 0.96, delay: i * 0.06 }"
            v-tilt
            :to="{ path: '/provinces', query: { region: r.name } }"
            class="region-card"
          >
            <span class="region-card-icon">🏯</span>
            <strong>{{ r.name }}</strong>
            <small>{{ r.provinces.join('、') }}</small>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 class="section-title">城市速览</h2>
            <p class="section-sub">横滑看看收录了哪些城市，点击直达所在省份</p>
          </div>
        </div>
        <div class="city-ticker">
          <div class="city-ticker-track">
            <RouterLink
              v-for="(c, i) in ticker"
              :key="`${c.provinceId}-${i}`"
              :to="`/province/${c.provinceId}`"
              class="city-chip"
            >
              {{ c.city }}
              <span class="p">{{ c.province }}</span>
            </RouterLink>
            <RouterLink
              v-for="(c, i) in ticker"
              :key="`dup-${c.provinceId}-${i}`"
              :to="`/province/${c.provinceId}`"
              class="city-chip"
              aria-hidden="true"
              tabindex="-1"
            >
              {{ c.city }}
              <span class="p">{{ c.province }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
