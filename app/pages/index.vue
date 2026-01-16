<script setup lang="ts">
// ========== IMPORTS ==========
import {computed} from 'vue'
import type {Skill, SkillsResponse} from '~/types/skill'
import FooterSection from "~/components/FooterSection.vue"
import type {JourneysResponse} from "~/types/journey";
import type {ProjectsResponse} from "~/types/project";
import type {UserSettingsModel} from "~/types/settings";

// ========== PAGE METADATA ==========
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Portfolio - Developer Showcase',
  meta: [
    {
      name: 'description',
      content: 'Explore my portfolio, projects, and skills. Full-stack developer showcasing professional work and experiences.',
    },
  ],
})

// ========== FETCH DATA FROM API (SSR-compatible) ==========
const {data: projectsData, pending: projectsLoading} = await useFetch<BaseResponse<ProjectsResponse>>('/api/projects', {
  query: {
    pagination: false,
    limit: 6,
  },
  watch: false,
})

const {data: skillsData, pending: skillsLoading} = await useFetch<BaseResponse<SkillsResponse>>('/api/skills', {
  query: {
    pagination: false,
  },
  watch: false,
})

const {data: journeysData, pending: journeysLoading} = await useFetch<BaseResponse<JourneysResponse>>('/api/journeys', {
  query: {
    pagination: false,
  },
  watch: false,
})

const {data: dataUser, pending: loadingUser} = await useFetch<BaseResponse<UserSettingsModel>>('/api/settings', {
  watch: false,
})

// ========== COMPUTED DATA ==========
const projects = computed(() => {
  const apiProjects = projectsData.value?.data?.data ?? []

  // Map API projects to expected format for components
  return apiProjects.map(p => ({
    ...p,
    id: p.id,
    title: p.name,
    shortDesc: p.description || '',
    description: p.description || '',
    image: p.preview_image || '/images/hero.png',
    technologies: p.technologies || [],
    link: p.repo_url,
    liveUrl: p.live_url || null,
    details: p.description,
    features: p.features || [],
  }))
})

const skills = computed(() => {
  return (skillsData.value?.data?.data ?? []) as Skill[]
})

const isLoading = computed(() => projectsLoading.value || skillsLoading.value || journeysLoading.value)

// ========== EXPERIENCE DATA dari API ==========
const experiences = computed(() => {
  const journeys = journeysData.value?.data?.data ?? []

  // Map API journeys to experiences format
  return journeys.map((journey) => ({
    id: journey.id,
    company: journey.company,
    position: journey.title,
    period: journey.is_current
        ? `${formatDate(journey.start_date)} - Present`
        : `${formatDate(journey.start_date)} - ${formatDate(journey.end_date)}`,
    description: journey.description || '',
    logo: "https://via.placeholder.com/80",
    responsibilities: journey.key_responsibilities || [],
    technologies: journey.skills || [],
    attachment: journey.attachments || null,
  }))
})

function diffInMonths(start: Date, end: Date): number {
  return (
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth())
  )
}

const totalExperienceYears = computed(() => {
  const journeys = journeysData.value?.data?.data ?? []
  let totalMonths = 0

  journeys.forEach((journey) => {
    if (!journey.start_date) return

    const start = new Date(journey.start_date)
    const end = journey.is_current
        ? new Date()
        : journey.end_date
            ? new Date(journey.end_date)
            : new Date()

    totalMonths += diffInMonths(start, end)
  })

  // convert ke tahun (1 angka desimal)
  return parseInt((totalMonths / 12).toFixed(0))
})

</script>

<template>
  <div class="text-white">
    <!-- Hero Section -->
    <main class="container mx-auto px-6 py-20">
      <HeroSection :user="dataUser?.data"/>
    </main>

    <!-- About Section -->
    <AboutSection :user="dataUser?.data" :count_projects="projects.length" :count_experience="totalExperienceYears"/>

    <!-- Skills Section -->
    <SkillsSection :skills="skills"/>

    <!-- Journey Section -->
    <JourneySection :experiences="experiences"/>

    <!-- Projects Section -->
    <ProjectsSection :projects="projects"/>

    <!-- Contact Section -->
    <ContactSection/>

    <!-- Footer Section -->
    <FooterSection/>

    <!-- AI Assistant Section -->
    <AIAssistant/>

  </div>
</template>

<style scoped>
/* ========== ANIMATIONS ========== */
@keyframes scroll-dot {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========== UTILITY CLASSES ========== */
.animate-scroll-dot {
  animation: scroll-dot 1.8s infinite;
}

/* ========== BUTTON STYLES ========== */
.primary-cta-btn {
  background: linear-gradient(135deg, #1e7fff 0%, #2196f3 50%, #0d47a1 100%);
  box-shadow: 0 10px 35px rgba(30, 127, 255, 0.3);
  transition: all 0.3s ease;
}

.primary-cta-btn:hover {
  box-shadow: 0 15px 45px rgba(30, 127, 255, 0.4);
  transform: translateY(-2px);
}
</style>

