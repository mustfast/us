<template>
  <section class="section">
    <h2>{{ section.title }}</h2>
    <ul class="duty-list">
      <li v-for="(item, i) in section.items" :key="i">{{ item }}</li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  section: { type: Object, required: true }
})
</script>
