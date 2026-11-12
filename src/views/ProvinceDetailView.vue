<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CityCard from '../components/CityCard.vue'
import SearchBox from '../components/SearchBox.vue'
import InkScene from '../components/InkScene.vue'
import { getProvince, searchCities } from '../data/store'
import { REGION_EMOJI } from '../data/regions'
import { toneOfRegion } from '../lib/tones'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { splitChars } from '../animations/splitChars'

const route = useRoute()
const province = computed(() => getProvince(route.params.id))
const query = ref('')
const cities = computed(() => (province.value ? searchCities(province.value, query.value) : []))

const tone = computed(() => toneOfRegion(province.value?.region))
const watermark = computed(() => (province.value ? province.value.name.slice(0, 1) : ''))

const root = ref(null)
let ctx = null
let split = null

watch(
  () => route.params.id,
  () => {
    query.value = ''
  }
)

const OVERVIEW_ICONS = {
  特色: '🏙',
  饮食: '🍜',
  文化: '🏮',
  历史: '📜',
  当地习惯: '☕'
}

onMounted(() => {
  if (prefersReducedMotion || !root.value) return
  const el = root.value
  if (!el.querySelector('.province-hero')) return

  ctx = gsap.context(() => {
    const q = gsap.utils.selector(el)
    const heading = el.querySelector('.province-hero-title h1')
    if (heading) split = splitChars(heading)

    const tl = gsap.timeline({ delay: 0.1 })
    tl.from(q('.breadcrumb'), { y: -14, opacity: 0, duration: 0.5 })
    if (split) {
      tl.from(
        split.chars,
        {
          yPercent: 85,
          opacity: 0,
          transformPerspective: 640,
          stagger: 0.06,
          duration: 0.7
        },
        '-=0.25'
      )
    }
    tl.from(
      q('.hero-seal'),
      {
        scale: 3.2,
        opacity: 0,
        rotate: -24,
        filter: 'blur(10px)',
        duration: 0.7,
        ease: 'back.out(1.7)'
      },
      '-=0.35'
    )
    tl.from(q('.hero-tag'), { y: 16, opacity: 0, stagger: 0.09, duration: 0.5 }, '-=0.3')
    tl.from(q('.hero-desc'), { y: 18, opacity: 0, duration: 0.6 }, '-=0.3')

    gsap.to(q('.province-hero .container'), {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: q('.province-hero'), start: 'top top', end: 'bottom top', scrub: true }
    })
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
    <template v-if="province">
      <section class="province-hero" :class="`tone-${tone}`">
        <InkScene class="province-scene" :tone="tone" />
        <span class="province-hero-watermark" aria-hidden="true">{{ watermark }}</span>
        <div class="province-side-note" aria-hidden="true">
          <span>{{ province.region }}</span>
          <span>城市印象</span>
        </div>
        <div class="container">
          <nav class="breadcrumb" aria-label="面包屑">
            <RouterLink to="/">首页</RouterLink>
            <span>/</span>
            <RouterLink to="/provinces">省份浏览</RouterLink>
            <span>/</span>
            <span>{{ province.name }}</span>
          </nav>
          <div class="province-hero-title">
            <h1>{{ province.name }}</h1>
            <span class="hero-seal">城</span>
          </div>
          <div class="hero-meta">
            <span class="hero-tag">{{ REGION_EMOJI[province.region] || '📍' }} {{ province.region }}</span>
            <span class="hero-tag">
              {{ province.cities.length ? `${province.cities.length} 座城市` : '区域概览' }}
            </span>
          </div>
          <p v-if="province.intro" class="hero-desc">{{ province.intro }}</p>
        </div>
      </section>

      <div class="container detail-body">
        <section v-if="Object.keys(province.overview).length" class="section detail-section">
          <h2 v-reveal="{ y: 18 }" class="section-title">全市概览</h2>
          <div class="overview-grid">
            <div
              v-for="(text, key, i) in province.overview"
              :key="key"
              v-reveal="{ yPercent: 12, scale: 0.97, delay: i * 0.07 }"
              v-tilt
              class="overview-item"
            >
              <h4>{{ OVERVIEW_ICONS[key] || '✦' }} {{ key }}</h4>
              <p>{{ text }}</p>
            </div>
          </div>
        </section>

        <section v-if="province.districts.length" class="section detail-section">
          <h2 v-reveal="{ y: 18 }" class="section-title">主要区域</h2>
          <div class="district-list">
            <div
              v-for="(d, i) in province.districts"
              :key="d.name"
              v-reveal="{ x: -24, yPercent: 6, delay: i * 0.06 }"
              class="district-item"
            >
              <strong>{{ d.name }}</strong>
              <span>{{ d.desc }}</span>
            </div>
          </div>
        </section>

        <section class="section detail-section">
          <div class="section-head">
            <div>
              <h2 v-reveal="{ y: 18 }" class="section-title">城市印象</h2>
              <p class="section-sub">
                {{
                  cities.length
                    ? `共 ${cities.length} 座城市，点击卡片查看城市详情`
                    : Object.keys(province.overview).length || province.districts.length
                      ? '该省份以全市概览与主要区域呈现'
                      : '该省份的城市内容整理中，敬请期待'
                }}
              </p>
            </div>
          </div>

          <div v-if="province.cities.length" v-reveal="{ y: 20, delay: 0.08 }" class="toolbar">
            <SearchBox
              v-model="query"
              :placeholder="`在${province.name}内搜索城市或关键词…`"
            />
          </div>

          <div v-if="cities.length" class="grid">
            <CityCard
              v-for="(c, i) in cities"
              :key="c.name"
              v-reveal="{ yPercent: 12, scale: 0.97, delay: (i % 4) * 0.06 }"
              :city="c"
              :province-id="province.id"
            />
          </div>

          <div v-else v-reveal="{ y: 20 }" class="empty-state">
            <div class="big">🏯</div>
            <p v-if="province.cities.length">没有找到匹配的城市，换个关键词试试？</p>
            <p v-else-if="Object.keys(province.overview).length || province.districts.length">
              这个省份以全市概览与主要区域呈现。
            </p>
            <p v-else>这个省份的内容正在整理中。</p>
          </div>
        </section>
      </div>
    </template>

    <div v-else class="container">
      <div class="empty-state not-found-inner">
        <div class="big">🪭</div>
        <h2>未找到该省份</h2>
        <p>可能还没有收录，去省份列表看看其他城市吧。</p>
        <RouterLink to="/provinces" class="btn">返回省份列表</RouterLink>
      </div>
    </div>
  </div>
</template>
