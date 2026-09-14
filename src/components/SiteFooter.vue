<script setup>
import { totalProvinces, totalCities } from '../data/store'
</script>

<template>
  <footer class="site-footer">
    <div v-reveal="{ y: 26, start: 'top bottom-=40' }" class="container footer-inner">
      <div class="footer-brand">中国特色城市 · 城市印象志</div>
      <p>目前收录 {{ totalProvinces }} 个省份、{{ totalCities }} 座城市的特色印象。</p>
      <p>内容整理自公开资料，持续补充中。</p>
    </div>
  </footer>
</template>
