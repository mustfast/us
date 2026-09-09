<template>
  <section class="section">
    <h2>{{ section.title }}</h2>
    <div v-for="(item, i) in section.items" :key="i" class="entry">
      <div class="entry-header">
        <span class="entry-title">{{ item.company }}</span>
        <span class="entry-date">{{ item.date }}</span>
      </div>
      <div class="entry-sub">{{ item.role }}</div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  section: { type: Object, required: true }
})
</script>
