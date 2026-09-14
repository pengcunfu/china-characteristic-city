<script setup>
import { REGION_EMOJI } from '../data/regions'

defineProps({
  province: { type: Object, required: true }
})
</script>

<template>
  <RouterLink v-tilt :to="`/province/${province.id}`" class="province-card">
    <div class="province-card-head">
      <span class="province-name">{{ province.name }}</span>
      <span class="region-tag">{{ REGION_EMOJI[province.region] || '📍' }} {{ province.region }}</span>
    </div>
    <p class="province-intro">{{ province.intro || '内容整理中，敬请期待…' }}</p>
    <div class="province-card-foot">
      <span class="city-count">
        {{ province.cities.length ? `${province.cities.length} 座城市` : province.districts.length ? '区域概览' : '内容整理中' }}
      </span>
      <span class="more">查看详情 →</span>
    </div>
  </RouterLink>
</template>
