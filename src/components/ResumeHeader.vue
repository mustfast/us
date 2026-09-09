<template>
  <header class="resume-header">
    <div>
      <h1>{{ header.name }}</h1>
      <div v-for="(s, i) in header.subtitle" :key="i" class="subtitle">{{ s }}</div>
    </div>
    <div class="contact">
      <div v-if="header.phone">📞 {{ header.phone }}</div>
      <div v-if="header.email">📧 <a :href="'mailto:' + header.email">{{ header.email }}</a></div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  header: { type: Object, required: true }
})
</script>
