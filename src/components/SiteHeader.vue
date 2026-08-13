<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)
watch(
  () => route.fullPath,
  () => {
    open.value = false
  }
)
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand" aria-label="返回首页">
        <span class="brand-seal">城</span>
        <span class="brand-text">
          <strong>中国特色城市</strong>
          <small>城市印象志</small>
        </span>
      </RouterLink>

      <nav class="nav" aria-label="主导航">
        <RouterLink to="/" exact-active-class="is-active">首页</RouterLink>
        <RouterLink to="/provinces" active-class="is-active">省份浏览</RouterLink>
      </nav>

      <button
        class="nav-toggle"
        :class="{ open }"
        type="button"
        aria-label="切换菜单"
        @click="open = !open"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <nav v-if="open" class="mobile-nav" aria-label="移动端导航">
      <RouterLink to="/" exact-active-class="is-active">首页</RouterLink>
      <RouterLink to="/provinces" active-class="is-active">省份浏览</RouterLink>
    </nav>
  </header>
</template>
