<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import InkScene from '../components/InkScene.vue'
import { getCity, getProvince } from '../data/store'
import { fieldsOf } from '../data/cityFields'
import { cityPath, provincePath } from '../lib/paths'
import { toneOfRegion } from '../lib/tones'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { splitChars } from '../animations/splitChars'

const route = useRoute()

const root = ref(null)
let ctx = null
let split = null

const province = computed(() => getProvince(route.params.id))
const city = computed(() => (province.value ? getCity(province.value.id, route.params.city) : null))
const tone = computed(() => toneOfRegion(province.value?.region))
const fields = computed(() => (city.value ? fieldsOf(city.value) : []))

const intro = computed(() => {
  if (!city.value) return ''
  return (
    city.value.intro ||
    city.value.details?.['特色'] ||
    `${city.value.name}位于${province.value.name}，以下从特色、景点、饮食、文化、交通等维度整理这座城市的印象。`
  )
})

const siblings = computed(() => {
  if (!province.value || !city.value) return []
  return province.value.cities.filter((item) => item.name !== city.value.name)
})

const cityIndex = computed(() => {
  if (!province.value || !city.value) return -1
  return province.value.cities.findIndex((item) => item.name === city.value.name)
})

const prevCity = computed(() =>
  cityIndex.value > 0 ? province.value.cities[cityIndex.value - 1] : null
)

const nextCity = computed(() => {
  if (!province.value || cityIndex.value < 0) return null
  return province.value.cities[cityIndex.value + 1] || null
})

onMounted(() => {
  if (prefersReducedMotion || !root.value || !city.value) return

  const el = root.value
  ctx = gsap.context(() => {
    const q = gsap.utils.selector(el)
    const heading = el.querySelector('.city-title-row h1')
    if (heading) split = splitChars(heading)

    const tl = gsap.timeline({ delay: 0.1 })
    tl.from(q('.breadcrumb'), { y: -14, opacity: 0, duration: 0.5 })
    tl.from(q('.city-kicker'), { y: 14, opacity: 0, duration: 0.5 }, '-=0.3')
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
        '-=0.35'
      )
    }
    tl.from(
      q('.city-hero .hero-seal'),
      {
        scale: 2.6,
        opacity: 0,
        rotate: -18,
        filter: 'blur(8px)',
        duration: 0.65,
        ease: 'back.out(1.7)'
      },
      '-=0.35'
    )
    tl.from(q('.city-hero .hero-tag'), { y: 16, opacity: 0, stagger: 0.09, duration: 0.5 }, '-=0.3')
    tl.from(q('.city-hero .hero-desc'), { y: 18, opacity: 0, duration: 0.6 }, '-=0.3')

    gsap.to(q('.city-hero .container'), {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: q('.city-hero'),
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
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
    <template v-if="city">
      <section class="city-hero" :class="`tone-${tone}`">
        <InkScene class="city-scene" :tone="tone" />
        <span class="city-hero-watermark" aria-hidden="true">{{ city.name }}</span>
        <div class="city-side-note" aria-hidden="true">
          <span>{{ province.region }}</span>
          <span>城市印象</span>
        </div>

        <div class="container">
          <nav class="breadcrumb" aria-label="面包屑">
            <RouterLink to="/">首页</RouterLink>
            <span>/</span>
            <RouterLink to="/provinces">省份浏览</RouterLink>
            <span>/</span>
            <RouterLink :to="provincePath(province.id)">{{ province.name }}</RouterLink>
            <span>/</span>
            <span>{{ city.name }}</span>
          </nav>

          <p class="city-kicker">{{ province.name }} · {{ province.region }}</p>
          <div class="city-title-row">
            <h1>{{ city.name }}</h1>
            <span class="hero-seal">邑</span>
          </div>

          <div class="hero-meta">
            <RouterLink class="hero-tag" :to="provincePath(province.id)">
              属 {{ province.name }} · {{ province.region }}
            </RouterLink>
            <span class="hero-tag">{{ fields.length }} 项城市印象</span>
          </div>

          <p class="hero-desc">{{ intro }}</p>
        </div>
      </section>

      <div class="container detail-body">
        <section class="section detail-section">
          <div class="section-head">
            <div>
              <h2 v-reveal="{ y: 18 }" class="section-title">城市名片</h2>
              <p v-reveal="{ y: 14, delay: 0.06 }" class="section-sub">
                从特色、景点、饮食、文化与日常里认识{{ city.name }}
              </p>
            </div>
            <span v-reveal="{ y: 10, delay: 0.1 }" class="section-charm">九州风物</span>
          </div>

          <div v-if="fields.length" class="city-field-grid">
            <article
              v-for="(field, i) in fields"
              :key="field.key"
              v-reveal="{ yPercent: 12, scale: 0.97, delay: (i % 3) * 0.06 }"
              v-tilt
              class="city-field"
            >
              <header>
                <span class="city-field-icon">{{ field.icon }}</span>
                <h3>{{ field.label }}</h3>
              </header>
              <p>{{ city.details[field.key] }}</p>
            </article>
          </div>

          <div v-else v-reveal="{ y: 20 }" class="empty-state">
            <div class="big">🏙</div>
            <p>这座城市的详细内容正在整理中。</p>
          </div>
        </section>

        <section v-if="siblings.length" class="section detail-section">
          <div class="section-head">
            <div>
              <h2 v-reveal="{ y: 18 }" class="section-title">同省城市</h2>
              <p v-reveal="{ y: 14, delay: 0.06 }" class="section-sub">
                {{ province.name }}共收录 {{ province.cities.length }} 座城市，继续看看别处
              </p>
            </div>
          </div>
          <div v-reveal="{ y: 14 }" class="city-siblings">
            <RouterLink
              v-for="item in siblings"
              :key="item.name"
              :to="cityPath(province.id, item.name)"
              class="sibling-chip"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </section>

        <nav class="city-pager" aria-label="城市翻页">
          <RouterLink
            v-if="prevCity"
            :to="cityPath(province.id, prevCity.name)"
            class="city-pager-link"
          >
            <small>上一座</small>
            <strong>← {{ prevCity.name }}</strong>
          </RouterLink>
          <span v-else class="city-pager-spacer"></span>

          <RouterLink :to="provincePath(province.id)" class="city-pager-back">
            返回{{ province.name }}
          </RouterLink>

          <RouterLink
            v-if="nextCity"
            :to="cityPath(province.id, nextCity.name)"
            class="city-pager-link is-next"
          >
            <small>下一座</small>
            <strong>{{ nextCity.name }} →</strong>
          </RouterLink>
          <span v-else class="city-pager-spacer"></span>
        </nav>
      </div>
    </template>

    <div v-else class="container">
      <div class="empty-state not-found-inner">
        <div class="big">🏙</div>
        <h2>未找到该城市</h2>
        <p>可能还没有收录，去省份列表看看其他城市吧。</p>
        <RouterLink to="/provinces" class="btn">返回省份浏览</RouterLink>
      </div>
    </div>
  </div>
</template>
