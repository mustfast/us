<template>
  <section class="section">
    <h2>{{ section.title }}</h2>
    <div v-for="(item, i) in section.items" :key="i" class="award-row">
      <span class="award-text">{{ item.text }}</span>
      <span v-if="item.date" class="award-date">{{ item.date }}</span>
    </div>
  </section>
</template>

<script setup>
defineProps({
  section: { type: Object, required: true }
})
</script>
