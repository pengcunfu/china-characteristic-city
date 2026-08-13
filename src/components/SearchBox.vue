<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '搜索省份、城市或关键词…' }
})
const emit = defineEmits(['update:modelValue', 'submit'])

const value = ref(props.modelValue)
watch(
  () => props.modelValue,
  (v) => {
    value.value = v
  }
)

function onInput(e) {
  value.value = e.target.value
  emit('update:modelValue', value.value)
}

function onSubmit() {
  emit('submit', value.value.trim())
}
</script>

<template>
  <form class="search-box" role="search" @submit.prevent="onSubmit">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" stroke-linecap="round" />
    </svg>
    <input
      :value="value"
      type="search"
      :placeholder="placeholder"
      aria-label="搜索"
      @input="onInput"
    />
    <button type="submit">搜索</button>
  </form>
</template>
