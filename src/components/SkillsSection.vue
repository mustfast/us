<template>
  <section class="section">
    <h2>{{ section.title }}</h2>
    <template v-if="section.mode === 'list'">
      <ol class="duty-list num-list">
        <li v-for="(item, i) in section.items" :key="i">{{ item }}</li>
      </ol>
    </template>
    <div v-else class="skills">
      <span v-for="(item, i) in section.items" :key="i" class="skill-tag">{{ item }}</span>
    </div>
  </section>
</template>

<script setup>
defineProps({
  section: { type: Object, required: true }
})
</script>
