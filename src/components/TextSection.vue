<template>
  <section class="section">
    <h2>{{ section.title }}</h2>
    <div class="entry-desc">
      <p v-for="(para, i) in section.paragraphs" :key="i">{{ para }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  section: { type: Object, required: true }
})
</script>
