<template>
  <section class="section edu">
    <h2>{{ section.title }}</h2>
    <div v-for="(item, i) in section.items" :key="i" class="entry">
      <div class="entry-header">
        <span class="entry-title">{{ item.school }}</span>
        <span class="entry-date">{{ item.date }}</span>
      </div>
      <div class="entry-sub">{{ item.degree }}</div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  section: { type: Object, required: true }
})
</script>
