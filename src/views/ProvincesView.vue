<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBox from '../components/SearchBox.vue'
import ProvinceCard from '../components/ProvinceCard.vue'
import { provinces, searchProvinces } from '../data/store'
import { REGIONS } from '../data/regions'
import { Flip, ScrollTrigger, prefersReducedMotion } from '../animations/gsap'

const route = useRoute()
const router = useRouter()
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const region = ref(typeof route.query.region === 'string' ? route.query.region : '')

const grid = ref(null)
let flipState = null

watch(
  () => route.query,
  (q) => {
    query.value = typeof q.q === 'string' ? q.q : ''
    region.value = typeof q.region === 'string' ? q.region : ''
  }
)

const list = computed(() => {
  let result = searchProvinces(query.value, provinces)
  if (region.value) result = result.filter((p) => p.region === region.value)
  return result
})

watch(
  list,
  () => {
    if (prefersReducedMotion || !grid.value) return
    const cards = Array.from(grid.value.querySelectorAll('.province-card'))
    flipState = cards.length ? Flip.getState(cards) : null
  },
  { flush: 'pre' }
)

watch(
  list,
  () => {
    if (!flipState) return
    Flip.from(flipState, {
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: () => ScrollTrigger.refresh()
    })
    flipState = null
  },
  { flush: 'post' }
)

function setRegion(name) {
  region.value = region.value === name ? '' : name
  router.replace({ query: { ...route.query, region: region.value || undefined } })
}

function onSearch(q) {
  router.replace({ query: { ...route.query, q: q || undefined } })
}
</script>

<template>
  <div class="container">
    <header v-reveal="{ y: 26 }" class="page-head">
      <h1 class="page-title">省份浏览</h1>
      <p class="page-sub">共收录 {{ provinces.length }} 个省份，输入关键词或按分区筛选</p>
    </header>

    <div v-reveal="{ y: 20, delay: 0.08 }" class="toolbar">
      <SearchBox v-model="query" @submit="onSearch" />
      <div class="chips" role="group" aria-label="按分区筛选">
        <button
          v-for="r in REGIONS"
          :key="r.name"
          type="button"
          class="chip"
          :class="{ 'is-active': region === r.name }"
          @click="setRegion(r.name)"
        >
          {{ r.name }}
        </button>
      </div>
    </div>

    <p v-if="list.length" v-reveal="{ y: 12, delay: 0.14 }" class="result-count">
      共 {{ list.length }} 个省份
    </p>

    <div v-if="list.length" ref="grid" class="grid">
      <ProvinceCard
        v-for="(p, i) in list"
        :key="p.id"
        v-reveal="{ yPercent: 12, scale: 0.97, delay: (i % 6) * 0.05 }"
        :province="p"
      />
    </div>

    <div v-else v-reveal="{ y: 20 }" class="empty-state">
      <div class="big">🔍</div>
      <p>没有找到匹配的省份或城市，换个关键词试试？</p>
      <RouterLink to="/provinces">清空筛选</RouterLink>
    </div>
  </div>
</template>
