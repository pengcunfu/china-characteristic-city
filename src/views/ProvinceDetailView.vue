<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CityCard from '../components/CityCard.vue'
import SearchBox from '../components/SearchBox.vue'
import { getProvince, searchCities } from '../data/store'
import { REGION_EMOJI } from '../data/regions'

const route = useRoute()
const province = computed(() => getProvince(route.params.id))
const query = ref('')
const cities = computed(() => (province.value ? searchCities(province.value, query.value) : []))

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
</script>

<template>
  <div v-if="province">
    <section class="province-hero">
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
        <h2 class="section-title">全市概览</h2>
        <div class="overview-grid">
          <div
            v-for="(text, key) in province.overview"
            :key="key"
            class="overview-item"
          >
            <h4>{{ OVERVIEW_ICONS[key] || '✦' }} {{ key }}</h4>
            <p>{{ text }}</p>
          </div>
        </div>
      </section>

      <section v-if="province.districts.length" class="section detail-section">
        <h2 class="section-title">主要区域</h2>
        <div class="district-list">
          <div v-for="d in province.districts" :key="d.name" class="district-item">
            <strong>{{ d.name }}</strong>
            <span>{{ d.desc }}</span>
          </div>
        </div>
      </section>

      <section class="section detail-section">
        <div class="section-head">
          <div>
            <h2 class="section-title">城市印象</h2>
            <p class="section-sub">
              {{
                cities.length
                  ? `共 ${cities.length} 座城市`
                  : Object.keys(province.overview).length || province.districts.length
                    ? '该省份以全市概览与主要区域呈现'
                    : '该省份的城市内容整理中，敬请期待'
              }}
            </p>
          </div>
        </div>

        <div v-if="province.cities.length" class="toolbar">
          <SearchBox
            v-model="query"
            :placeholder="`在${province.name}内搜索城市或关键词…`"
          />
        </div>

        <div v-if="cities.length" class="grid">
          <CityCard v-for="c in cities" :key="c.name" :city="c" />
        </div>

        <div v-else class="empty-state">
          <div class="big">🏯</div>
          <p v-if="province.cities.length">没有找到匹配的城市，换个关键词试试？</p>
          <p v-else-if="Object.keys(province.overview).length || province.districts.length">
            这个省份以全市概览与主要区域呈现。
          </p>
          <p v-else>这个省份的内容正在整理中。</p>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="container">
    <div class="empty-state not-found-inner">
      <div class="big">🪭</div>
      <h2>未找到该省份</h2>
      <p>可能还没有收录，去省份列表看看其他城市吧。</p>
      <RouterLink to="/provinces" class="btn">返回省份列表</RouterLink>
    </div>
  </div>
</template>
