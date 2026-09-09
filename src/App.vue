<template>
  <div class="page">
    <ResumeHeader :header="resume.header" />
    <component
      v-for="(sec, i) in resume.sections"
      :key="i"
      :is="compMap[sec.type] || TextSection"
      :section="sec"
    />
  </div>
</template>

<script setup>
import ResumeHeader from './components/ResumeHeader.vue'
import EducationSection from './components/EducationSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import TextSection from './components/TextSection.vue'
import ListSection from './components/ListSection.vue'
import AwardsSection from './components/AwardsSection.vue'

defineProps({
  resume: { type: Object, required: true }
})

const compMap = {
  education: EducationSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  text: TextSection,
  list: ListSection,
  awards: AwardsSection
}
</script>
