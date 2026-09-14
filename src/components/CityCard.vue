<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: { type: Object, required: true }
})

const ROWS = [
  { key: '特色', label: '特色', icon: '🏙' },
  { key: '景点', label: '景点', icon: '🗺' },
  { key: '饮食', label: '饮食', icon: '🍜' },
  { key: '特产', label: '特产', icon: '🎁' },
  { key: '文化', label: '文化', icon: '🏮' },
  { key: '节庆', label: '节庆', icon: '🎊' },
  { key: '历史', label: '历史', icon: '📜' },
  { key: '交通', label: '交通', icon: '🚄' },
  { key: '当地习惯', label: '习惯', icon: '☕' }
]

const rows = computed(() => ROWS.filter((r) => props.city.details[r.key]))
</script>

<template>
  <article v-tilt class="city-card">
    <header class="city-card-head">
      <h3>{{ city.name }}</h3>
      <span class="city-badge">城市</span>
    </header>
    <p v-if="city.intro" class="city-intro">{{ city.intro }}</p>
    <dl v-if="rows.length" class="city-details">
      <div v-for="row in rows" :key="row.key" class="detail-row">
        <dt><span class="detail-icon">{{ row.icon }}</span>{{ row.label }}</dt>
        <dd>{{ city.details[row.key] }}</dd>
      </div>
    </dl>
    <p v-else class="city-empty">内容整理中，敬请期待…</p>
  </article>
</template>
