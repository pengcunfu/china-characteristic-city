<script setup>
import { computed } from 'vue'
import { fieldsOf } from '../data/cityFields'
import { cityPath } from '../lib/paths'

const props = defineProps({
  city: { type: Object, required: true },
  provinceId: { type: String, required: true }
})

const rows = computed(() => fieldsOf(props.city))
const highlights = computed(() => rows.value.slice(0, 3))
const summary = computed(() => props.city.intro || props.city.details?.['特色'] || '')

function snippet(text, max = 42) {
  const value = String(text || '')
  return value.length > max ? `${value.slice(0, max)}…` : value
}
</script>

<template>
  <RouterLink
    v-tilt
    :to="cityPath(provinceId, city.name)"
    class="city-card"
    :aria-label="`查看${city.name}城市详情`"
  >
    <header class="city-card-head">
      <h3>{{ city.name }}</h3>
      <span class="city-badge">城市</span>
    </header>
    <p v-if="summary" class="city-intro">{{ snippet(summary, 62) }}</p>
    <div v-if="highlights.length" class="city-highlights">
      <div v-for="row in highlights" :key="row.key" class="city-highlight">
        <span class="detail-icon">{{ row.icon }}</span>
        <span class="city-highlight-label">{{ row.label }}</span>
        <span class="city-highlight-text">{{ snippet(city.details[row.key]) }}</span>
      </div>
    </div>
    <p v-else class="city-empty">内容整理中，敬请期待…</p>
    <footer class="city-card-foot">
      <span>{{ rows.length }} 项城市印象</span>
      <span class="more">阅读详情 →</span>
    </footer>
  </RouterLink>
</template>
