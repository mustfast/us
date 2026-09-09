<template>
  <section class="section">
    <h2>{{ section.title }}</h2>

    <div v-for="(company, ci) in section.companies" :key="ci" class="company">
      <h3 class="company-name">{{ company.name }}</h3>
      <div v-if="company.meta" class="company-meta">{{ company.meta }}</div>

      <div v-for="(p, pi) in company.projects" :key="pi" class="project">
        <h3>{{ p.title }}</h3>
        <div v-if="p.meta" class="meta">{{ p.meta }}</div>
        <div v-if="p.desc" class="desc">{{ p.desc }}</div>
        <ul v-if="p.duties && p.duties.length" class="duty-list">
          <li v-for="(d, di) in p.duties" :key="di">{{ d }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  section: { type: Object, required: true }
})
</script>
