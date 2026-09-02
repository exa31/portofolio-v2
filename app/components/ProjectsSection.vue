<script setup lang="ts">
import { computed, ref } from 'vue'

interface Project {
  id?: number;
  title: string;
  shortDesc: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  liveUrl?: string;
  details: string;
  features: string[];
}

const props = defineProps<{
  projects: Project[]
}>()

const { onMouseMove } = useSpotlight()

const selectedProject = ref<Project | null>(null)
const isModalOpen = ref(false)
const copied = ref(false)
const activeFilter = ref('All')

const openProjectModal = (project: Project) => {
  selectedProject.value = project
  isModalOpen.value = true
  copied.value = false
}

const closeModal = () => {
  isModalOpen.value = false
  selectedProject.value = null
}

const copyToClipboard = (text?: string) => {
  if (text) {
    navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// Project category inference
const getProjectCategory = (p: Project): string => {
  const t = (p.technologies || []).map(x => x.toLowerCase()).join(' ')
  const desc = (p.description || '').toLowerCase()
  if (t.includes('flutter') || t.includes('dart') || desc.includes('mobile')) return 'Mobile Apps'
  if (t.includes('k8s') || t.includes('docker') || t.includes('go') || desc.includes('microservice') || desc.includes('backend')) return 'Backend & Cloud'
  return 'Full-Stack'
}

const categories = ['All', 'Full-Stack', 'Backend & Cloud', 'Mobile Apps']

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return props.projects
  return props.projects.filter(p => getProjectCategory(p) === activeFilter.value)
})
</script>

<template>
  <section id="project" class="py-20 sm:py-24 relative overflow-hidden" aria-labelledby="projects-heading">
    <div class="container mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <Motion
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.15 }"
        :transition="{ duration: 0.45, ease: 'easeOut' }"
        class="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
      >
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
          <Icon name="carbon:application-web" size="14" />
          <span>PORTFOLIO SHOWCASE</span>
        </div>
        <h2 id="projects-heading" class="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight mb-4">
          Featured <span class="text-gradient-primary">Engineering Projects</span>
        </h2>
        <p class="text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
          A showcase of full-stack web applications, scalable backend microservices, and mobile products engineered for real-world reliability.
        </p>
      </Motion>

      <!-- Category Filter Pills Bar -->
      <div class="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeFilter = cat"
          class="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer"
          :class="activeFilter === cat
            ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10'
            : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Projects Grid with Linear Spotlight & Browser Mockup -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        <Motion
          v-for="(project, index) in filteredProjects"
          :key="project.id ?? index"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.1 }"
          :transition="{
            duration: 0.45,
            delay: (index % 3) * 0.08,
            ease: 'easeOut'
          }"
          @click="openProjectModal(project)"
          @mousemove="onMouseMove"
          class="spotlight-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between"
        >
          <!-- Browser Mockup Window Frame -->
          <div>
            <div class="px-4 py-2.5 bg-[#0a0f1d] border-b border-white/[0.08] flex items-center justify-between">
              <!-- Window dots -->
              <div class="flex items-center gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80"></div>
              </div>

              <!-- URL bar mock -->
              <div class="px-3 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] font-mono text-slate-400 max-w-[170px] truncate flex items-center gap-1">
                <Icon name="carbon:locked" size="10" class="text-emerald-400 shrink-0" />
                <span>{{ project.liveUrl ? project.liveUrl.replace('https://', '') : 'preview.internal' }}</span>
              </div>

              <!-- Status indicator -->
              <span
                v-if="project.liveUrl"
                class="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>LIVE</span>
              </span>
              <span v-else class="text-[10px] font-mono text-slate-500">CASE</span>
            </div>

            <!-- Project Banner Image -->
            <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
              <NuxtImg
                :src="project.image || '/images/project-preview.webp'"
                :alt="project.title"
                class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                loading="lazy"
                width="600"
                height="340"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-[#0d1424]/20 to-transparent"></div>

              <!-- Hover explore icon -->
              <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200">
                <Icon name="carbon:arrow-up-right" size="16" />
              </div>
            </div>
          </div>

          <!-- Project Details Container -->
          <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <h3 class="text-xl font-heading font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {{ project.title }}
                </h3>
              </div>

              <p class="text-slate-300 text-sm leading-relaxed mb-5 line-clamp-2 font-normal">
                {{ project.shortDesc || project.description }}
              </p>
            </div>

            <!-- Technology Chips & Action -->
            <div class="pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tech in project.technologies.slice(0, 3)"
                  :key="tech"
                  class="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                >
                  {{ tech }}
                </span>
                <span
                  v-if="project.technologies.length > 3"
                  class="px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-500 bg-white/[0.02]"
                >
                  +{{ project.technologies.length - 3 }}
                </span>
              </div>

              <span class="text-xs font-mono text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                <span>Details</span>
                <Icon name="carbon:chevron-right" size="14" />
              </span>
            </div>
          </div>
        </Motion>
      </div>

    </div>

    <!-- Project Details Modal -->
    <UModal
      v-model:open="isModalOpen"
      :ui="{
        content: 'w-full max-w-4xl bg-[#090e1a] border border-white/15 shadow-2xl rounded-3xl overflow-hidden',
        header: 'p-6 sm:p-8 bg-[#0c1424] border-b border-white/10',
        body: 'p-6 sm:p-8 max-h-[70vh] overflow-y-auto',
        footer: 'p-4 sm:p-6 bg-[#0c1424] border-t border-white/10'
      }"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-mono text-blue-400 uppercase tracking-wider">PROJECT ARCHITECTURE DEEP DIVE</span>
          <h2 class="text-2xl sm:text-3xl font-heading font-black text-white">
            {{ selectedProject?.title }}
          </h2>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Featured Image Display -->
          <div class="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
            <NuxtImg
              :src="selectedProject?.image || '/images/project-preview.webp'"
              :alt="selectedProject?.title"
              class="w-full h-64 sm:h-80 object-cover"
              width="800"
              height="450"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-transparent"></div>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Icon name="carbon:code" size="20" />
              </div>
              <div>
                <p class="text-[10px] font-mono uppercase text-slate-400">Stack</p>
                <p class="text-xs sm:text-sm font-semibold text-white">{{ selectedProject?.technologies.length || 0 }} Technologies</p>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Icon name="carbon:star" size="20" />
              </div>
              <div>
                <p class="text-[10px] font-mono uppercase text-slate-400">Features</p>
                <p class="text-xs sm:text-sm font-semibold text-white">{{ selectedProject?.features.length || 0 }} Key Features</p>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
                :class="selectedProject?.liveUrl ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'"
              >
                <Icon :name="selectedProject?.liveUrl ? 'carbon:network-4' : 'carbon:document'" size="20" />
              </div>
              <div>
                <p class="text-[10px] font-mono uppercase text-slate-400">Status</p>
                <p class="text-xs sm:text-sm font-semibold text-white">{{ selectedProject?.liveUrl ? 'Live Production' : 'Completed Project' }}</p>
              </div>
            </div>
          </div>

          <!-- Project Overview Description -->
          <div>
            <h3 class="text-sm font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
              <Icon name="carbon:align-box-top-left" size="16" class="text-blue-400" />
              <span>Project Architecture & Overview</span>
            </h3>
            <div class="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
              <p class="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
                {{ selectedProject?.details || selectedProject?.description }}
              </p>
            </div>
          </div>

          <!-- Key Features Checklist -->
          <div v-if="selectedProject?.features?.length">
            <h3 class="text-sm font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
              <Icon name="carbon:checkbox-checked" size="16" class="text-emerald-400" />
              <span>Key Features & Functional Highlights</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="(feature, idx) in selectedProject?.features"
                :key="idx"
                class="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/10"
              >
                <Icon name="carbon:checkmark-filled" size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                <span class="text-xs sm:text-sm text-slate-200 leading-relaxed">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Tech Stack Badges -->
          <div v-if="selectedProject?.technologies?.length">
            <h3 class="text-sm font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
              <Icon name="carbon:terminal" size="16" class="text-cyan-400" />
              <span>Built With</span>
            </h3>
            <div class="flex flex-wrap gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <span
                v-for="tech in selectedProject?.technologies"
                :key="tech"
                class="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Live Preview Link Bar -->
          <div v-if="selectedProject?.liveUrl" class="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Icon name="carbon:link" size="20" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-mono uppercase text-blue-300">Live URL</p>
                <p class="text-xs font-mono text-slate-300 truncate max-w-xs sm:max-w-md">{{ selectedProject.liveUrl }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="copyToClipboard(selectedProject?.liveUrl)"
                class="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Icon :name="copied ? 'carbon:checkmark' : 'carbon:copy'" size="14" :class="copied ? 'text-emerald-400' : 'text-slate-400'" />
                <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
              </button>

              <a
                :href="selectedProject.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Live</span>
                <Icon name="carbon:arrow-up-right" size="14" />
              </a>
            </div>
          </div>

        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between w-full">
          <a
            v-if="selectedProject?.link"
            :href="selectedProject.link"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary-subtle px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center gap-2"
          >
            <Icon name="line-md:github" size="18" />
            <span>View Source Code</span>
          </a>
          <span v-else></span>

          <UButton
            color="neutral"
            variant="outline"
            size="md"
            @click="closeModal"
            class="rounded-xl px-5 cursor-pointer text-slate-300 hover:text-white"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>

  </section>
</template>
