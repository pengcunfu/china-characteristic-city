<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBox from '../components/SearchBox.vue'
import ProvinceCard from '../components/ProvinceCard.vue'
import InkScene from '../components/InkScene.vue'
import VistaCard from '../components/VistaCard.vue'
import { REGIONS } from '../data/regions'
import { totalProvinces, totalCities, featuredProvinces, cityTicker } from '../data/store'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { splitChars } from '../animations/splitChars'
import { countUp } from '../animations/reveal'

const router = useRouter()
const query = ref('')
const featured = featuredProvinces(12)
const ticker = cityTicker(48)

const vistas = [
  {
    key: 'jiangnan',
    title: '江南',
    sub: '水乡烟雨',
    line: '小桥流水人家，杏花春雨江南',
    place: '苏州 · 周庄'
  },
  {
    key: 'beihai',
    title: '塞北',
    sub: '大漠孤烟',
    line: '大漠孤烟直，长河落日圆',
    place: '敦煌 · 鸣沙山'
  },
  {
    key: 'xueyu',
    title: '雪域',
    sub: '高原圣境',
    line: '一念见雪山，万籁俱寂时',
    place: '拉萨 · 纳木错'
  },
  {
    key: 'haijiao',
    title: '海角',
    sub: '碧海潮生',
    line: '面朝大海，春暖花开',
    place: '厦门 · 鼓浪屿'
  }
]

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

    const brush = el.querySelector('.hero-brush path')
    if (brush) {
      const len = brush.getTotalLength()
      gsap.set(brush, { strokeDasharray: len, strokeDashoffset: len })
      tl.to(brush, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, '-=0.45')
    }

    tl.from(q('.hero-sub'), { y: 20, opacity: 0, duration: 0.7 }, '-=0.6')
    tl.from(q('.hero-search'), { y: 24, opacity: 0, scale: 0.96, duration: 0.7 }, '-=0.52')
    tl.from(q('.hero-stat'), { y: 22, opacity: 0, stagger: 0.09, duration: 0.6 }, '-=0.45')
    tl.from(q('.hero-side-note'), { opacity: 0, duration: 0.9 }, '-=0.7')
    tl.from(q('.hero-cue'), { opacity: 0, duration: 0.6 }, '-=0.2')

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
      <InkScene class="hero-scene" tone="ember" />
      <div class="hero-side-note" aria-hidden="true">
        <span>山河入梦</span>
        <span>城市如诗</span>
      </div>

      <div class="container hero-inner">
        <p class="hero-eyebrow">一方水土 · 一方风情</p>
        <h1 class="hero-title">中国<span class="accent">特色城市</span></h1>
        <svg class="hero-brush" viewBox="0 0 320 20" aria-hidden="true">
          <path d="M6 13 C 72 4, 152 17, 314 9" />
          <path class="hero-brush-thin" d="M54 18 C 122 14, 212 18, 268 15" />
        </svg>
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
    </section>

    <section class="section section-vistas">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 v-reveal="{ y: 18 }" class="section-title">山河图景</h2>
            <p v-reveal="{ y: 14, delay: 0.08 }" class="section-sub">
              四时风物，各有各的诗意
            </p>
          </div>
          <span v-reveal="{ y: 10, delay: 0.12 }" class="section-charm">水墨四景</span>
        </div>
        <div class="vista-grid">
          <VistaCard
            v-for="(v, i) in vistas"
            :key="v.key"
            v-reveal="{ yPercent: 10, scale: 0.97, delay: i * 0.08 }"
            :item="v"
            :index="i"
          />
        </div>
      </div>
    </section>

    <div class="container">
      <BrushDivider />
    </div>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2 v-reveal="{ y: 18 }" class="section-title">特色省份精选</h2>
            <p v-reveal="{ y: 14, delay: 0.08 }" class="section-sub">
              从直辖市到文化大省，先认识这些最具代表性的地方
            </p>
          </div>
          <RouterLink v-reveal="{ y: 10, delay: 0.12 }" to="/provinces" class="section-more">
            全部省份 →
          </RouterLink>
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
            <h2 v-reveal="{ y: 18 }" class="section-title">按地理分区浏览</h2>
            <p v-reveal="{ y: 14, delay: 0.08 }" class="section-sub">
              华北、东北、华东……每个分区都有自己的气质
            </p>
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
            <h2 v-reveal="{ y: 18 }" class="section-title">城市速览</h2>
            <p v-reveal="{ y: 14, delay: 0.08 }" class="section-sub">
              横滑看看收录了哪些城市，点击直达所在省份
            </p>
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
